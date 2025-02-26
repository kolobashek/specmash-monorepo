const typeDefs = `#graphql
  type Mutation {
    #Users
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User
    #Auth
    register(input: RegisterUserInput!): User
    login(phone: String!, password: String!): LoginPayload
    #Shifts
    createTravelLog(input: CreateTravelLogInput!): TravelLog
    updateTravelLog(input: UpdateTravelLogInput!): TravelLog
    #Machines
    createEquipment(input: CreateEquipmentInput): Equipment
    updateEquipment(input: UpdateEquipmentInput!): Equipment
    #Partners
    createPartner(input: CreatePartnerInput!): Partner
    updatePartner(input: UpdatePartnerInput!): Partner
    #WorkPlaces
    createWorkPlace(input: CreateWorkPlaceInput!): WorkPlace
    updateWorkPlace(input: UpdateWorkPlaceInput!): WorkPlace
  }
`
export default typeDefs
