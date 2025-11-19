# -----------------------------------------
# Fix-SQL-WMI.ps1
# SQL Server WMI Provider Repair Script
# -----------------------------------------

Write-Host "Starting SQL Server WMI repair..." -ForegroundColor Cyan

# ----------- Step 1: Ensure Script Runs as Admin -----------
If (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
    [Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Host "Please run PowerShell as Administrator." -ForegroundColor Red
    exit
}

# ----------- Step 2: Stop WMI Service -----------
Write-Host "Stopping WMI service..." -ForegroundColor Yellow
Stop-Service winmgmt -Force

# ----------- Step 3: Repair WMI Repository -----------
Write-Host "Repairing WMI Repository..." -ForegroundColor Yellow
winmgmt /salvagerepository | Out-Null
winmgmt /verifyrepository

# ----------- Step 4: Restart WMI -----------
Write-Host "Restarting WMI service..." -ForegroundColor Yellow
Start-Service winmgmt

# ----------- Step 5: Recompile SQL Server MOF Files -----------
Write-Host "Recompiling SQL Server WMI provider..." -ForegroundColor Yellow

# Detect SQL versions
$paths = @(
    "C:\Program Files (x86)\Microsoft SQL Server\160\Shared\sqlmgmproviderxpsp2up.mof",
    "C:\Program Files (x86)\Microsoft SQL Server\150\Shared\sqlmgmproviderxpsp2up.mof",
    "C:\Program Files (x86)\Microsoft SQL Server\140\Shared\sqlmgmproviderxpsp2up.mof",
    "C:\Program Files (x86)\Microsoft SQL Server\130\Shared\sqlmgmproviderxpsp2up.mof"
)

foreach ($mof in $paths) {
    if (Test-Path $mof) {
        Write-Host "Found MOF file: $mof"
        mofcomp $mof | Out-Null
    }
}

# ----------- Step 6: Fix SQL Server Registry Permissions -----------
Write-Host "Fixing SQL Server registry permissions..." -ForegroundColor Yellow

$regPath = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server"
icacls $regPath /grant Administrators:F /t | Out-Null

# ----------- Step 7: Restart SQL Services -----------
Write-Host "Restarting SQL Server Services..." -ForegroundColor Yellow

$SqlServices = Get-Service | Where-Object { $_.Name -like "MSSQL*" -or $_.Name -like "SQL*" }

foreach ($svc in $SqlServices) {
    try {
        Restart-Service $svc.Name -Force
        Write-Host "Restarted service: $($svc.Name)" -ForegroundColor Green
    } catch {
        Write-Host "Could not restart service: $($svc.Name)" -ForegroundColor DarkYellow
    }
}

Write-Host "`nAll repairs completed successfully!" -ForegroundColor Green
Write-Host "Now open SQL Server Configuration Manager (Run as Administrator)."
