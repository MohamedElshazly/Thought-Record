import { dayIdToDate, isValidDayId, type DayId } from "@/lib/day-id"

export type DayRecord = {
	id: DayId
	date: DayId
	content: string
	createdAt: string
	updatedAt: string
}

type DayRecordStore = Record<DayId, DayRecord>

export const DAY_RECORDS_STORAGE_KEY = "thought-records.v1"
export const DAY_RECORDS_CHANGED_EVENT = "thought-records:changed"

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value)

const canUseStorage = () =>
	typeof window !== "undefined" && typeof window.localStorage !== "undefined"

const normalizeRecord = (id: DayId, value: unknown): DayRecord | null => {
	if (!isObject(value)) {
		return null
	}

	if (
		typeof value.content !== "string" ||
		typeof value.createdAt !== "string" ||
		typeof value.updatedAt !== "string"
	) {
		return null
	}

	return {
		id,
		date: id,
		content: value.content,
		createdAt: value.createdAt,
		updatedAt: value.updatedAt,
	}
}

const readStore = (): DayRecordStore => {
	if (!canUseStorage()) {
		return {}
	}

	const rawStore = window.localStorage.getItem(DAY_RECORDS_STORAGE_KEY)
	if (!rawStore) {
		return {}
	}

	try {
		const parsedStore: unknown = JSON.parse(rawStore)
		if (!isObject(parsedStore)) {
			return {}
		}

		const normalizedStore: DayRecordStore = {}

		for (const [dayId, value] of Object.entries(parsedStore)) {
			if (!isValidDayId(dayId)) {
				continue
			}

			const normalizedRecord = normalizeRecord(dayId, value)
			if (!normalizedRecord) {
				continue
			}

			normalizedStore[dayId] = normalizedRecord
		}

		return normalizedStore
	} catch {
		return {}
	}
}

const writeStore = (store: DayRecordStore) => {
	if (!canUseStorage()) {
		return
	}

	window.localStorage.setItem(DAY_RECORDS_STORAGE_KEY, JSON.stringify(store))
}

export function getDayRecord(id: DayId): DayRecord | null {
	if (!isValidDayId(id)) {
		return null
	}

	const store = readStore()
	return store[id] ?? null
}

export function upsertDayRecord(id: DayId, content: string): DayRecord {
	if (!isValidDayId(id)) {
		throw new Error(`Invalid day id: ${id}`)
	}

	const store = readStore()
	const existingRecord = store[id]
	const now = new Date().toISOString()

	const nextRecord: DayRecord = {
		id,
		date: id,
		content,
		createdAt: existingRecord?.createdAt ?? now,
		updatedAt: now,
	}

	store[id] = nextRecord
	writeStore(store)

	return nextRecord
}

export function listDayRecordIds(): DayId[] {
	const store = readStore()
	return Object.entries(store)
		.filter((entry): entry is [DayId, DayRecord] => isValidDayId(entry[0]))
		.filter(([, record]) => record.content.trim().length > 0)
		.map(([dayId]) => dayId)
		.sort()
}

export const getFormattedDay = (dayId: DayId) => {
	const date = dayIdToDate(dayId)
	if (!date) {
		return dayId
	}
	return date.toLocaleDateString(undefined, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}
