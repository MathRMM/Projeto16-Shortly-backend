import joi from "joi";

const signUpSchemas = joi.object({
    name: joi
        .string()
        .max(50)
        .required()
        .label("Porfavor escreva seu nome com até 50 caracteres."),
    email: joi.string().email().required().label("Deve ser um email valido."),
    password: joi.string().required().label("Por favor escreva uma senha."),
    confirmPassword: joi
        .string()
        .valid(joi.ref("password"))
        .label("Senha e Confirme Senha estão diferentes."),
});

const signInSchemas = joi.object({
    email: joi.string().email().required().label("Deve ser um email valido."),
    password: joi.string().required().label("Por favor escreva a sua senha."),
});

const newUrlSchema = joi.object({
    url: joi
        .string()
        .regex(
            /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/
        )
        .required()
        .label("Por favor insira uma url valida."),
});

const tokenSchema = joi.object({
    token: joi
        .string()
        .guid({
            version: ["uuidv4"],
        })
        .required()
        .label("Token invalido"),
});

export { signUpSchemas, signInSchemas, newUrlSchema, tokenSchema };
