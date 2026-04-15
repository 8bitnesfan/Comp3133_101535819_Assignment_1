const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const resolvers = {
    Query: {
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });
            if (!user) throw new Error("User not found");

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error("Invalid password");

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return { token, user };
        },

        getEmployees: async () => {
            return await Employee.find();
        },

        getEmployeeById: async (parent, { id }) => {
            const employee = await Employee.findById(id);
            if (!employee) throw new Error("Employee not found");
            return employee;
        },

        searchEmployee: async (parent, { designation, department }) => {
            return await Employee.find({
                $or: [{ designation }, { department }]
            });
        },
    },

    Mutation: {

        signup: async (parent, { input }) => {
            const { username, email, password } = input;

            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            return await newUser.save();
        },

        addEmployee: async (parent, args) => {
            try {

                if (!args.salary || Number(args.salary) < 1000) {
                    throw new Error("Salary must be at least 1000");
                }

                const employee = new Employee({
                    ...args,

                    salary: Number(args.salary),

                    date_of_joining: args.date_of_joining
                        ? new Date(args.date_of_joining)
                        : null,

                    gender: args.gender && args.gender !== ""
                        ? args.gender
                        : "Other"
                });

                const saved = await employee.save();
                console.log("🔥 SAVED EMPLOYEE:", saved);

                return saved;

            } catch (err) {
                console.error("ADD EMPLOYEE ERROR:", err);
                throw new Error(err.message);
            }
        },

        updateEmployee: async (parent, { id, input }) => {
            const updated = await Employee.findByIdAndUpdate(
                id,
                {
                    ...input,
                    salary: input.salary ? Number(input.salary) : undefined,
                    date_of_joining: input.date_of_joining
                        ? new Date(input.date_of_joining)
                        : undefined
                },
                { new: true }
            );

            if (!updated) throw new Error("Employee not found");
            return updated;
        },

        deleteEmployee: async (parent, { id }) => {
            const deleted = await Employee.findByIdAndDelete(id);
            if (!deleted) throw new Error("Employee not found");
            return "Employee deleted successfully";
        },
    },
};

module.exports = resolvers;