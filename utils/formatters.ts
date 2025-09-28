export const maskPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");

    return value;
};

export const unmaskPhone = (value: string) => value.replace(/\D/g, "") || "";

