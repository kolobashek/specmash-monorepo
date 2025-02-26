const typeDefs = `#graphql
  type Query {
    users(input: UsersFilterInput): AllUsers!
    me: User
    user(id:ID!): User
    isActive(userId: ID!): Boolean
    findByPhone(phone: String!): User
    
    roles: [Role]!

    getEquipmentTypes: [EquipmentType]!

    equipments: [Equipment]!
    equipment(id: ID!): Equipment
    equipmentByType(typeId: ID!): [Equipment]!

    workPlaces: [WorkPlace]!
    workPlace(id: ID!): WorkPlace

    partners: [Partner]!
    partner(id: ID!): Partner

    travelLogs(dateStart: String, dateEnd: String, user: [String], equipment: [String], comments: String): [TravelLog]
    travelLog(id: ID!): TravelLog!
  }
`
export default typeDefs
