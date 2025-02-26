export const machines = {
	updateMachine: /* GraphQL */ `
		mutation updateEquipment($input: UpdateEquipmentInput!) {
			updateEquipment(input: $input) {
				id
				type
				name
				dimensions
				weight
				licensePlate
				nickname
			}
		}
	`,

	getMachines: /* GraphQL */ `
		query getEquipments {
			equipments {
				id
				type
				name
				dimensions
				weight
				licensePlate
				nickname
			}
		}
	`,

	getMachineById: /* GraphQL */ `
		query equipment($id: ID!) {
			equipment(id: $id) {
				id
				type
				name
				dimensions
				weight
				licensePlate
				nickname
			}
		}
	`,

	getMachineTypes: /* GraphQL */ `
		query getEquipmentTypes {
			getEquipmentTypes {
				id
				name
			}
		}
	`,

	createMachine: /* GraphQL */ `
		mutation CreateEquipment($input: CreateEquipmentInput!) {
			createEquipment(input: $input) {
				id
			}
		}
	`,
}
