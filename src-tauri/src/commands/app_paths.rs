use serde::Serialize;

#[derive(Serialize)]
pub struct AppPaths {
    pub app_data_dir: String,
}

#[tauri::command]
pub fn get_app_paths() -> Result<AppPaths, String> {
    Ok(AppPaths {
        app_data_dir: ".veradmin-dev".into(),
    })
}