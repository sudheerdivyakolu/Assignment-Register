const bcrypt = require("bcrypt");
const User = require("../models/user");
const Assignment = require("../models/assignment");

const handleLogin = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res
			.status(400)
			.json({ 'message': "Username and Password are required" });

	const foundUser = await User.findOne({ username }).exec();
	if (!foundUser) return res.status(401).json({ 'message': "unauthorized" });

	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		req.session.userId = foundUser._id.toString();

		return res.json({ 'success': `User ${foundUser.username} logged in` });
	}

	res.status(401).json({ 'message': "Invalid user" });
};

const handleSignup = async (req, res, next) => {
	const { username, password, mail } = req.body;
	if (!username || !password || !mail)
		return res.status(400).json({
			'message': "Username, Password and mail are required",
		});
	if (password.length < 8)
		return res
			.status(400)
			.json({ 'message': "password must have minimun length of 8 characters" });

	const duplicateUser = await User.findOne({ username }).exec();
	if (duplicateUser)
		return res.status(409).json({ 'message': "User already exists!" });
	const duplicateMail = await User.findOne({ mail }).exec();
	if (duplicateMail)
		return res
			.status(409)
			.json({ 'message': "User already exists with this mail" });

	const regexUser = /^[A-Za-z][A-Za-z_0-9]{7,30}$/g;
	const regexMail = /^[A-Za-z][A-Za-z0-9.-_]+@[A-za-z]+\.[A-Za-z]{1,}$/g;
	const validUser = regexUser.test(username);
	const validMail = regexMail.test(mail);
	if (!validUser)
		return res.status(406).json({
			'message':
				"Username should contain only alphabets or numbers or underscore and minimun 8 characters required",
		});
	if (!validMail)
		return res
			.status(406)
			.json({ 'message': "Mail should be correctly formatted" });

	try {
		const pwdhash = await bcrypt.hash(password, 10);
		//creating user
		const query = await User.create({
			username,
			password: pwdhash,
			mail,
		});

		req.session.userId = query._id.toString();
		res.status(201).json({ 'success': `User ${query.username} created` });
	} catch (err) {
		next(err);
	}
};

const handleSessionData = (req, res) => {
	const { userId } = req.session;

	res.json({ userId });
};

const handleLogout = (req, res) => {
	const { userId } = req.session;
	if (!userId) return res.status(200).json({ 'message': "No content" });

	req.session.destroy();
	res.status(204).json({ 'message': "No content" });
};

const handleDelete = async (req, res, next) => {
	const { userId } = req.session;
	if (!userId)
		return res.status(400).json({ 'message': "User not found" });

	try {
		const foundUser = await User.findByIdAndDelete(userId).exec();

		if (!foundUser) return res.status(400).json("User not found");

		const query = await Assignment.deleteMany({ user: userId });

		req.session.destroy((err) => {
			if (err) return next(err);
		});

		res.status(201).json({ 'success': `User ${foundUser.username} is deleted` });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	handleLogin,
	handleSignup,
	handleDelete,
	handleLogout,
	handleSessionData,
};
