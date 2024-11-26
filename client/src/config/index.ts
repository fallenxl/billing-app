export default  {
    API: process.env.NODE_ENV === 'development' ? 'http://localhost:4001/api/billing/v1' : 'https://api.lumenenergysolutions.com/api/billing/v1',
    WS_API: process.env.NODE_ENV === 'development' ? 'ws://localhost:4001/api/billing/v1' : 'wss://api.lumenenergysolutions.com/api/billing/v1',
}