export type DayId = string

const DAY_ID_REGEX = /^\d{4}-\d{2}-\d{2}$/

const toTwoDigits = (value: number) => String(value).padStart(2, "0")

export function toDayId(date: Date): DayId {
	return `${date.getFullYear()}-${toTwoDigits(date.getMonth() + 1)}-${toTwoDigits(
		date.getDate()
	)}`
}

export function isValidDayId(value: string): value is DayId {
	if (!DAY_ID_REGEX.test(value)) {
		return false
	}

	const [yearString, monthString, dayString] = value.split("-")
	const year = Number(yearString)
	const monthIndex = Number(monthString) - 1
	const day = Number(dayString)

	if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || !Number.isInteger(day)) {
		return false
	}

	const parsedDate = new Date(year, monthIndex, day)

	return (
		parsedDate.getFullYear() === year &&
		parsedDate.getMonth() === monthIndex &&
		parsedDate.getDate() === day
	)
}

export function dayIdToDate(value: DayId): Date | null {
	if (!isValidDayId(value)) {
		return null
	}

	const [yearString, monthString, dayString] = value.split("-")
	const year = Number(yearString)
	const monthIndex = Number(monthString) - 1
	const day = Number(dayString)

	return new Date(year, monthIndex, day)
}
