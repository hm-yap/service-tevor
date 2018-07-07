import express from 'express';
const app = express();

app.get('/', (req, res) => res.send('Initial version - root path. TBD manage routes from ./routes'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
