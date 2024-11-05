const m_user = require("../model/m_user");


const bcrypt        = require('bcryptjs');

// Define percobaan as a standalone function
function percobaan(inputpassword) {
    return bcrypt.hashSync(inputpassword); // No salt rounds specified
}


// Define a function to check if the current password matches the stored password
async function checkOldPassword(email, inputPassword) {
    try {
        // Retrieve user data by email
        let user = await m_user.cari_id(email);

        if (user.length === 0) {
            throw new Error("User not found.");
        }

        // Extract the stored password from the user data
        const storedPassword = user[0].password;

        // Compare the input password with the stored password
        return bcrypt.compareSync(inputPassword, storedPassword);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    user_profile: async function (req, res) {
        let email = req.body.user_email;
        let newPassword = req.body.form_newpassword;
        let oldPassword = req.body.form_oldpassword; // Read current password from POST request

        if (!email) {
            return res.redirect('/login');
        }

        if (!newPassword) {
            return res.send("New password is required.");
        }

        try {
            // Check if the old password matches the stored password
            const isOldPasswordCorrect = await checkOldPassword(email, oldPassword);

            if (!isOldPasswordCorrect) {
                return res.render('profile_page', { notifikasi: "Current password is incorrect." });
            }

            // Check if the user exists
            let check = await m_user.cari_id(email);

            if (check.length > 0) {
                // Use the `percobaan` function to hash the new password
                const hashedPassword = percobaan(newPassword);

                // Attempt to update the password in the database
                let updateResult = await m_user.update_pass(hashedPassword, email);

                // Check if any rows were affected
                if (updateResult.affectedRows > 0) {
                    const notifikasi = "Password updated successfully!";
                    res.render('profile_page', { notifikasi });
                } else {
                    const notifikasi = "Password update failed. Please try again.";
                    res.render('profile_page', { notifikasi });
                }
            } else {
                res.send("User not found.");
            }
        } catch (error) {
            res.send(`An error occurred: ${error.message}`);
        }
    }
};


