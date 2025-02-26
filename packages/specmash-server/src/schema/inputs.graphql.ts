import { Equipment } from './../models/equipment'
const typeDefs = `#graphql

  input UserIdInput {
    userId: Int!
  }
  input IdName {
    id: Int
    name: String
  }
  input RegisterUserInput {
    name: String!
    phone: String!
    password: String!
    nickname: String
    comment: String
  }
  input CreateUserInput {
    name: String!
    phone: String!
    roles: [Int]!
    nickname: String
    comment: String
  }
  input UpdateUserInput {
    id: Int!
    name: String!
    phone: String!
    password: String
    roles: [Int]
    nickname: String
    comment: String
  }

  input CreateTravelLogInput {
    driver: Int
    workPlace: Int
    partner: Int
    equipment: Int
    date: String!
    shiftNumber: Int!
    hoursWorked: Float
    breaks: Float
    comments: String
  }

  input CreatePartnerInput {
    name: String!
    contacts: String
    address: String
    comments: String
    workPlaces: [Int]
  }

  input UpdateTravelLogInput {
    id: Int!
    driverId: Int
    workPlaceId: Int
    equipmentId: Int
    date: String!
    shiftNumber: Int!
    hoursWorked: Float
    breaks: Float
    comments: String
  }
  
  input UpdatePartnerInput {
    id: Int!
    name: String!
    contacts: String
    address: String
    comments: String
    workPlaces: [Int]
  }

  input CreateWorkPlaceInput {
    name: String!
    contacts: String
    address: String
    partners: [Int]
  }
  input UpdateWorkPlaceInput {
    id: Int!
    name: String!
    contacts: String
    address: String
    partners: [Int]
  }

  input CreateEquipmentInput {
    name: String!
    typeId: Int!
    # type: EquipmentType!
    dimensions: String
    weight: Int
    licensePlate: String
    nickname: String
  }
  input UpdateEquipmentInput {
    id: Int!
    name: String!
    type: String
    dimensions: String
    weight: Int
    licensePlate: String
    nickname: String
  }
  input UsersFilterInput {
    phone: String
    name: String
	  roles: [Int]
    equipmentType: [Int]
    limit: Int
    offset: Int
    deleted: Boolean
    createdAt: String
    sort: String
    order: String
    search: String
  }
`
export default typeDefs
