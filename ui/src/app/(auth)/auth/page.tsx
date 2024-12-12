"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ICredentials } from "@/interfaces"
import { useState } from "react"
import { signInService } from "@/services"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/stores/user-store"
import { LoadingProcess } from "@/components/loadings/loading-process"

export default function AuthPage() {
    const router = useRouter()
    const { setUser } = useUserStore(state => state)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [credentials, setCredentials] = useState<ICredentials>({
        username: "",
        password: "",
    })
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        })
    }
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        
        e.preventDefault()
        setIsLoading(true)
        const res = await signInService(credentials)
        setIsLoading(false)

        if (res.success && res.data) {
            setUser(res.data?.user)
            localStorage.setItem("jwt", res.data?.token)
            router.replace("/")
        } else {
            setError(res.message)
        }
    }
    return (
        <Card className="border-0 shadow-none md:border md:px-10">
            {isLoading && <LoadingProcess/>}
            <CardHeader className="text-center pt-10">
                <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
                <CardDescription className="font-bold">Please sign in to your account</CardDescription>
                {error && <CardDescription className="text-red-500 bg-red-100 border-l-2 py-2  border-l-red-500">{error}</CardDescription>}
            </CardHeader>
            <CardContent>
                <form
                    id="login-form"
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                onChange={handleChange}
                                name="username" type="text" placeholder="ex. example@lumenenergysolutions.com" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                onChange={handleChange}
                                name="password" type="password" placeholder="****************" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col justify-center w-full">
                <Button
                    className="w-full bg-muted-light/90"
                    form="login-form"
                    type="submit"
                > Sign in </Button>
                {/* if not remember your password please contact to support here */}
                <small className="text-center text-xs mt-6 text-neutral-500 ">
                    If you don't remember your password, please contact support
                    <a href="mailto:axl.santos@lumenenergysolutions.com" className="text-blue-500 underline"> here</a>
                </small>
            </CardFooter>
        </Card>
    )
}
