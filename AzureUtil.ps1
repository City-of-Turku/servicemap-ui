$resourceGroup = "turku-dev"
$registry = "turkudev"
$image = "servicemap-ui"
$webApp = "servicemap-ui"

switch ($args[0]) {
    "build" {
        az acr build --resource-group $resourceGroup --registry $registry --image $image .
    }
    "log" {
        az webapp log tail --resource-group $resourceGroup --name $webApp
    }
    "config" {
        switch ($args[1]) {
            $null {
                az webapp config appsettings list --resource-group $resourceGroup --name $webApp | ConvertFrom-Json | Sort-Object -Property name | ForEach-Object { "$($_.name)=$($_.value)" }
            }
            "delete" {
                az webapp config appsettings delete --resource-group $resourceGroup --name $webApp --setting-names ($args | Select-Object -Skip 1)
            }
            Default {
                az webapp config appsettings set --resource-group $resourceGroup --name $webApp --settings ($args | Select-Object -Skip 1)
            }
        }
    }
    Default {
       "Usage:"
       ""
       "./AzureUtil build"
       "`tBuild a new image in the WebApp's Azure container registry"
       "./AzureUtil log"
       "`tView the WebApp's log stream"
       "./AzureUtil config"
       "`tShow the WebApp's environment variables in a .env file format"
       "./AzureUtil config setting1=value1 setting2=value2 ..."
       "`tAssign the given values in the WebApp's environment variables"
       "./AzureUtil config delete setting1 setting2 ..."
       "`tDelete the given keys from the WebApp's environment variables"
    }
}