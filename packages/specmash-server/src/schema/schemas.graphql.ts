const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    nickname: String
    password: String
    phone: String!
    roles: [Role]
    comment: String
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }
  type AllUsers {
    rows: [User]!
    count: Int!
  }
  type LoginPayload {
    token: String!
    user: User!
  }
  type Role {
    id: Int!
    name: String!
    comment: String
  }
  type Auth {
    token: String!
    user: User!
  }
  type Equipment {
    id: ID!
    type: EquipmentType!
    name: String!
    dimensions: String
    weight: Int
    licensePlate: String
    nickname: String	
  }
  type EquipmentType {
    id: ID!
    name: String!
    drivingLicenseCategory: String
    comment: String
  }
  type WorkPlace {
    id: ID!
    name: String!
    contacts: String
    address: String
    partners: [Partner]
  }
  type Partner {
    id: ID!
    name: String!
    contacts: String
    address: String
    comments: String
    workPlaces: [WorkPlace]
  }
  type TravelLog {
    id: ID!
    driver: User
    workPlace: WorkPlace 
    partner: Partner
    equipment: Equipment
    date: String
    shiftNumber: Int
    hoursWorked: Float
    breaks: Float
    comment: String
    createdAt: String
    updatedAt: String
    deletedAt: String
  }
`
export default typeDefs
