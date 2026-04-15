const { gql } = require("apollo-server-express");

module.exports = gql`
  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    department: String
    date_of_joining: String
    employee_photo: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    login(username: String, email: String, password: String!): AuthPayload
    getEmployees: [Employee]
    getEmployeeById(id: ID!): Employee
    searchEmployee(designation: String, department: String): [Employee]
  }

  type Mutation {
    signup(input: SignupInput!): User

    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
      employee_photo: String
    ): Employee

    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee

    deleteEmployee(id: ID!): String
  }
`;