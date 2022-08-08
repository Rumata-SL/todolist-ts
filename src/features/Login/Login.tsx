import React from "react"
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    TextField,
    Button,
    Grid
} from "@material-ui/core"
import {useFormik} from "formik"
import {useDispatch, useSelector} from "react-redux"
import {loginTC} from "./auth-reducer"
import {AppRootStateType, useAppDispatch} from "../../app/store"
import {Redirect} from "react-router-dom"

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}
export const Login = () => {
    const dispatch = useAppDispatch()

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                return {
                    email: "Email is required"
                }
            }
            if (!values.password) {
                return {
                    password: "Password is required"
                }
            }

        },
        initialValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        onSubmit: async (values, formikHelpers) => {
            const action = await dispatch(loginTC(values));
            if (loginTC.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const err= action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(err.field, err.error)
                }
            }
        },
    })

    if (isLoggedIn) {
        return <Redirect to={"/"}/>
    }


    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered <a
                            href={"https://social-network.samuraijs.com/"}
                            target={"blank"}>here</a>
                        </p>
                        <p>
                            or use common test account credentials:
                        </p>
                        <p> Email: free@samuraijs.com
                        </p>
                        <p>
                            Password: free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.errors.email ? <div
                            style={{color: "red"}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.errors.password ?
                            <div>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={"Remember me"}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={"submit"} variant={"contained"}
                                color={"primary"}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
