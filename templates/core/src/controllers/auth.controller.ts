import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import httpStatus from 'http-status'
import { ApiResponse } from '../models/response.model'
import AuthService from './../services/auth.service'
import supabase from '../config/supabase'

export class AuthController {
  public async register(req: Request, res: Response) {
    const { name, email, password, role, remarks } = req.body

    try {
      const requiredFields = {
        name: {
          type: 'string',
          validator: (value: string) => {
            if (value.split(' ').length < 2) {
              throw new Error('Name must contain at least 2 words')
            }
          },
        },
        email: {
          type: 'string',
          validator: (value: string) => {
            if (!value.includes('@')) {
              throw new Error('Invalid email address')
            }
          },
        },
        password: {
          type: 'string',
          validator: (value: string) => {
            if (value.length < 8) {
              throw new Error('Password must be at least 8 characters long')
            }

            // Check if password contains at least one uppercase letter
            if (!/[A-Z]/.test(value)) {
              throw new Error(
                'Password must contain at least one uppercase letter'
              )
            }

            // Check if password contains at least one special character
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
              throw new Error(
                'Password must contain at least one special character'
              )
            }
          },
        },
        role: {
          type: 'string',
          validator: (value: string) => {
            if (
              // Define the valid role types here
              ['ADMIN', 'USER'].indexOf(value) === -1
            ) {
              throw new Error('Invalid role type')
            }
          },
        },
      } as Record<string, any>

      for (const field in requiredFields) {
        if (!req.body[field]) {
          throw new Error(`${field} is required`)
        }
        if (typeof req.body[field] !== requiredFields[field].type) {
          throw new Error(`${field} must be of type ${requiredFields[field]}`)
        }

        requiredFields[field].validator(req.body[field])
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            remarks,
            suspended: false,
          },
        },
      })

      if (error) throw new Error(error.message)

      const response = new ApiResponse({
        status: httpStatus.OK,
        message: 'OK',
        data: data,
        errors: null,
      })
      return res.status(httpStatus.OK).json(response)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status || httpStatus.BAD_REQUEST
        const response = new ApiResponse({
          status,
          message: 'AXIOS_ERROR',
          data: null,
          errors: err.response?.data,
        })
        return res.status(status).json(response)
      }
      const response = new ApiResponse({
        status: httpStatus.BAD_REQUEST,
        message: 'BAD_REQUEST',
        data: null,
        errors: {
          message: err.message,
        },
      })
      return res.status(httpStatus.BAD_REQUEST).json(response)
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body

    try {
      if (!email) {
        throw new Error('Email is required')
      }

      if (!password) {
        throw new Error('Password is required')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      const response = new ApiResponse({
        status: httpStatus.OK,
        message: 'OK',
        data: data,
        errors: null,
      })
      return res.status(httpStatus.OK).json(response)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status || httpStatus.BAD_REQUEST
        const response = new ApiResponse({
          status,
          message: 'AXIOS_ERROR',
          data: null,
          errors: err.response?.data,
        })
        return res.status(status).json(response)
      }
      const response = new ApiResponse({
        status: httpStatus.BAD_REQUEST,
        message: 'BAD_REQUEST',
        data: null,
        errors: {
          message: err.message,
        },
      })
      return res.status(httpStatus.BAD_REQUEST).json(response)
    }
  }

  public async encryptObject(req: Request, res: Response, next: NextFunction) {
    try {
      const authService = new AuthService()
      const encryptedString = authService.encryptObject(
        JSON.stringify(req.body)
      )
      return res.status(200).json({
        data: encryptedString,
      })
    } catch (err) {
      return res.status(400).json(err.message)
    }
  }

  public async decryptObject(req: Request, res: Response, next: NextFunction) {
    try {
      const authService = new AuthService()
      const decryptedObj = authService.decryptObject(req.body.payload)
      return res.status(200).json({
        data: JSON.parse(decryptedObj),
      })
    } catch (err) {
      return res.status(400).json(err.message)
    }
  }
}

export default new AuthController()
