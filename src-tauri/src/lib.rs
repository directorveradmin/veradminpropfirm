use std::{
    fs::{self, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    time::SystemTime,
};

use tauri::Manager;
use tauri_plugin_shell::ShellExt;

const SIDECAR_NAME: &str = "veradmin-node";

fn append_startup_log(app: &tauri::AppHandle, message: &str) {
    if let Ok(dir) = app.path().app_data_dir() {
        let _ = fs::create_dir_all(&dir);
        let log_path = dir.join("veradmin-startup.log");
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(log_path) {
            let _ = writeln!(file, "[{:?}] {}", SystemTime::now(), message);
        }
    }
}

fn packaged_workspace_root(app: &tauri::AppHandle) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let root = app.path().app_data_dir()?.join("veradmin-runtime");
    fs::create_dir_all(root.join("data"))?;
    Ok(root)
}

fn resolve_launcher(resource_dir: &PathBuf) -> Option<PathBuf> {
    let candidates = [
        resource_dir.join("server-launcher.cjs"),
        resource_dir.join("resources").join("server-launcher.cjs"),
    ];

    for candidate in candidates {
        if candidate.exists() {
            return Some(candidate);
        }
    }

    None
}

fn sidecar_arg(path: &Path) -> String {
    let raw = path.to_string_lossy().to_string();

    #[cfg(windows)]
    {
        if let Some(stripped) = raw.strip_prefix(r"\\?\") {
            return stripped.to_string();
        }
    }

    raw
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            append_startup_log(app.handle(), "setup:start");

            if cfg!(debug_assertions) {
                append_startup_log(app.handle(), "debug build detected; sidecar skipped");
                return Ok(());
            }

            let resource_dir = app.path().resource_dir()?;
            append_startup_log(app.handle(), &format!("resource_dir={}", resource_dir.display()));

            let launcher = match resolve_launcher(&resource_dir) {
                Some(path) => path,
                None => {
                    append_startup_log(app.handle(), "launcher missing");
                    return Err("Missing packaged sidecar launcher in expected resource paths".into());
                }
            };

            let workspace_root = packaged_workspace_root(app.handle())?;
            let launcher_arg = sidecar_arg(&launcher);
            let workspace_arg = sidecar_arg(&workspace_root);

            append_startup_log(app.handle(), &format!("launcher={}", launcher.display()));
            append_startup_log(app.handle(), &format!("launcher_arg={}", launcher_arg));
            append_startup_log(app.handle(), &format!("workspace_root={}", workspace_root.display()));
            append_startup_log(app.handle(), &format!("workspace_arg={}", workspace_arg));

            match app
                .shell()
                .sidecar(SIDECAR_NAME)?
                .arg(launcher_arg)
                .arg(workspace_arg)
                .spawn()
            {
                Ok((_rx, _child)) => {
                    append_startup_log(app.handle(), "sidecar spawn:ok");
                    Ok(())
                }
                Err(error) => {
                    append_startup_log(app.handle(), &format!("sidecar spawn:error={error}"));
                    Err(error.into())
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Veradmin desktop shell");
}