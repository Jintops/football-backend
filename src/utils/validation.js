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

module.exports={validProfileEdit}