const validateSignIn = async (email, password, res) => {
    let validity = true;

    console.log("Validating SignIn Input");
        // Validate user input
        if (!(email && password )) {
            validity = false;
            res.status(400).send("Please enter all parameters");
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            validity = false;
            res.status(400).send("Please enter a valid email.");
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            validity = false;
            res.status(400).send("Please enter a valid password.");
        } 

        return validity;
       
};
module.exports = { validateSignIn };