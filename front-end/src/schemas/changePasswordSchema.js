import * as yup from "yup"

export const changePasswordSchema = yup.object().shape({
    password: yup
        .string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, 'A senha deve ter no mínimo 6 caracteres e conter ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.')
        .required('Nova senha é obrigatória'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'As senhas devem coincidir')
        .required('Confirmação de senha é obrigatória'),
});