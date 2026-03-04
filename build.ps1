$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "eas"
$psi.Arguments = "build --platform android --profile preview"
$psi.WorkingDirectory = "c:\Users\Daniel\Documents\Projetos\manga-reader"
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $false

$process = [System.Diagnostics.Process]::Start($psi)

# Wait a bit for the prompt
Start-Sleep -Seconds 15

# Send 'y' to stdin
$process.StandardInput.WriteLine("y")
$process.StandardInput.Flush()

# Read output
while (!$process.HasExited) {
    $line = $process.StandardOutput.ReadLine()
    if ($line) { Write-Host $line }
    Start-Sleep -Milliseconds 100
}

$process.WaitForExit()
Write-Host "Build process completed with exit code: $($process.ExitCode)"
