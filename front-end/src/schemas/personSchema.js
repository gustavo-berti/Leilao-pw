import * as yup from "yup"

export const personSchema = yup.object().shape({
    name: yup.string().required("Nome é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    password: yup.string().required("Senha é obrigatória").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, 'A senha deve ter no mínimo 6 caracteres e conter ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'As senhas devem ser iguais').required('Confirmação de senha é obrigatória'),
    loginInvalid: yup.string().oneOf([yup.ref('email'), null], 'Email ou senha inválidos').required('Email ou senha inválidos')
})
