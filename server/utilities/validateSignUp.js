
const validateSignUp = async (first_name, last_name, email, password, res) => {
    let validity = true;

    console.log("Validating User");
        // Validate user input
        if (!(email && password && first_name && last_name)) {
            validity = false;
            res.status(400).send("Please enter all parameters");
        } else if (!/^[a-zA-Z]*$/.test(first_name)) {
            validity = false;
            res.status(400).send("Please enter a valid first name.");
        } else if (!/^[a-zA-Z]*$/.test(last_name)) {
            validity = false;
            res.status(400).send("Please enter a valid last name.");
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            validity = false;
            res.status(400).send("Please enter a valid email.");
        } else if (email === password) {
            validity = false;
            res.status(400).send("Password cannot be the same as email.");
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            validity = false;
            res.status(400).send("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.");
        } 

        return validity;
       
};
module.exports = { validateSignUp };