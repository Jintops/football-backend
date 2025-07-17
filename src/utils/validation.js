const validator=require('validator')


const validProfileEdit=(req)=>{
    const allowedUpdate=[
        "firstName",
        "lastName",
        "gender",
        "photoUrl"
    ];
    const isValidEdit=Object.keys(req.body).every((field)=>{
        allowedUpdate.includes(field)
    })
    return isValidEdit
}

const validPassword=(req)=>{
    const {password}=req.body
    if(!validator.isStrongPassword(password)){
        throw new Error("Not a strong Password")
    }
}

module.exports={validProfileEdit,validPassword}