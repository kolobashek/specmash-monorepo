export const shifts = {
	getShifts: /* GraphQL */ `
		query travelLogs($dateStart: String, $dateEnd: String) {
			travelLogs(dateStart: $dateStart, dateEnd: $dateEnd) {
				id
				driver {
					id
					name
				}
				object {
					id
					name
				}
				equipment {
					id
					name
				}
				date
				shiftNumber
				hours
				breaks
				comment
			}
		}
	`,
	getShiftById: /* GraphQL */ `
		query travelLog($id: ID!) {
			travelLog(id: $id) {
				id
				driver {
					id
					name
				}
				object {
					id
					name
				}
				equipment {
					id
					name
				}
				date
				shiftNumber
				hours
				breaks
				comment
			}
		}
	`,
	createShift: /* GraphQL */ `
		mutation createTravelLog($input: CreateTravelLogInput!) {
			createTravelLog(input: $input) {
				id
				driver {
					id
					name
				}
				object {
					id
					name
				}
				contrAgent {
					id
					name
				}
				equipment {
					id
					name
				}
				date
				shiftNumber
				hours
				breaks
				comments
			}
		}
	`,
	updateShift: /* GraphQL */ `
		mutation updateTravelLog($input: UpdateTravelLogInput!) {
			updateTravelLog(input: $input) {
				id
				driver {
					id
					name
				}
				object {
					id
					name
				}
				contrAgent {
					id
					name
				}
				equipment {
					id
					name
				}
				date
				shiftNumber
				hours
				breaks
				comments
			}
		}
	`,
}
