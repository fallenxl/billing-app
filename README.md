# Lumen Billing

Lumen Billing es una aplicación que permite gestionar y calcular las facturas basadas en datos obtenidos de dispositivos IoT (medidores de agua, energía, etc.) mediante la API de ThingsBoard. El proyecto está dividido en dos partes: un servidor en Go y un cliente en React.

## Contenido del Repositorio

- **Server**: Implementado en Go, este servidor utiliza Air para el desarrollo en caliente y se comunica con la API de ThingsBoard para obtener datos de dispositivos y gestionar la facturación.
- **Client**: Cliente de la aplicación implementado en React, donde los usuarios pueden interactuar con las funcionalidades de facturación y visualización de dispositivos.

## Instalación

### Server

1. Clona este repositorio:
   ```bash
   git clone https://github.com/usuario/lumen-billing.git
   cd lumen-billing/server
    ```
2. Instala **Go** si aun no lo tienes instalado.

3. Instala Air para desarrollo en caliente:
```bash 
    go install github.com/cosmtrek/air@latest
```
4. Configura las variables de entorno para la conexión con la API de ThingsBoard. Debes proporcionar las credenciales y la URL de la API.

Crea un archivo .env en el directorio server con las siguientes variables:
```env
TB_API_URL=https://thingsboard.url
TB_ACCESS_TOKEN=your_access_token
```
5. Inicia el servidor en modo desarrollo con Air:
```bash 
    npm run dev
```

### Client

1. Ve al directorio del cliente:
```bash 
    cd lumen-billing/client
```

2. Instala las dependencias del proyecto:
```bash 
    npm install
```
3. Ejecuta la aplicación en modo desarrollo:
```bash 
    npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Contribuciones
Si deseas contribuir al proyecto, abre un pull request o crea un issue en el repositorio. Toda contribución es bienvenida.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.