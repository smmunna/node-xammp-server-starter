import express, { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import cors from 'cors'
import { userRoutes } from './app/modules/user/user.route'
import helmet from 'helmet'

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use('/uploads', express.static('uploads'))

// Route handlings;
app.use('/api/v1/users', userRoutes)

// SSL Commerze or any redirect routes will be Here, from controller with functions

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Node.js Server',
        author: 'Minhazul Abedin Munna',
        github: 'https://github.com/smmunna',
        linkedin: 'https://www.linkedin.com/in/minhazulabedinmunna/',
    })
})

// Route Error
app.all('*', (req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: 'Not Found'
    })
})

// Global Error Handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

export default app;