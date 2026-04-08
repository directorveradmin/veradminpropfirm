# Step9_Scaffold.ps1
# Scaffold all Step 9 screens and update navigation map

# Ensure directories exist
$screenDir = "src/app/screens"
if (-not (Test-Path $screenDir)) { New-Item -ItemType Directory -Path $screenDir }

# Screen scaffolds
$screens = @("JournalScreen", "PayoutsScreen", "AlertsScreen", "CalendarRotationScreen")
foreach ($screen in $screens) {
    $filePath = "$screenDir\$screen.tsx"
    if (-not (Test-Path $filePath)) {
        @"
import React from 'react';

interface ${screen}Props {
    // TODO: define props as needed
}

const $screen: React.FC<${screen}Props> = () => {
    return (
        <div>
            <h1>$screen</h1>
            {/* Header */}
            <div className='header'>
                <p>Header/Controls placeholder</p>
            </div>
            {/* Summary / Strip */}
            <div className='summary-strip'>
                <p>Summary metrics placeholder</p>
            </div>
            {/* Main List / Timeline / Calendar */}
            <div className='main-content'>
                <p>Main content placeholder</p>
            </div>
            {/* Detail Drawer / Panel */}
            <div className='detail-drawer'>
                <p>Detail drawer placeholder</p>
            </div>
        </div>
    );
};

export default $screen;
"@ | Set-Content -Path $filePath
        Write-Host "Scaffolded $screen at $filePath"
    } else {
        Write-Host "$screen already exists, skipping..."
    }
}

# Update navigation map placeholder
$navFile = "src/app/navigationMap.ts"
if (-not (Test-Path $navFile)) {
    @"
// Step 9: Navigation map including Step 9 screens
export const screens = {
    Dashboard: '/dashboard',
    Accounts: '/accounts',
    Journal: '/screens/JournalScreen',
    Payouts: '/screens/PayoutsScreen',
    Alerts: '/screens/AlertsScreen',
    CalendarRotation: '/screens/CalendarRotationScreen',
    Settings: '/settings'
};
"@ | Set-Content -Path $navFile
    Write-Host "Created navigationMap.ts with Step 9 screens"
} else {
    Write-Host "navigationMap.ts already exists, please manually merge Step 9 screens if needed"
}

Write-Host "Step 9 scaffolding complete."