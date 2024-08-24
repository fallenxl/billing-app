export default  {
    API: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api/billing/v1' : 'https://api.lumenenergysolutions.com/api/billing/v1',
}