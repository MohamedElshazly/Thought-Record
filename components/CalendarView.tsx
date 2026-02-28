"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { addDays } from "date-fns"
import { dayIdToDate, toDayId } from "@/lib/day-id"
import {
	DAY_RECORDS_CHANGED_EVENT,
	DAY_RECORDS_STORAGE_KEY,
	listDayRecordIds,
} from "@/lib/day-records"

export const CalendarWithPresets = () => {
	const router = useRouter()
	const [date, setDate] = React.useState<Date | undefined>(
		new Date(new Date().getFullYear(), 1, 12)
	)
	const [currentMonth, setCurrentMonth] = React.useState<Date>(
		new Date(new Date().getFullYear(), new Date().getMonth(), 1)
	)
	const [datesWithContent, setDatesWithContent] = React.useState<Date[]>([])

	const refreshDatesWithContent = React.useCallback(() => {
		const nextDatesWithContent = listDayRecordIds()
			.map((dayId) => dayIdToDate(dayId))
			.filter((recordDate): recordDate is Date => recordDate !== null)

		setDatesWithContent(nextDatesWithContent)
	}, [])

	React.useEffect(() => {
		refreshDatesWithContent()

		const handleStorageChange = (event: StorageEvent) => {
			if (event.key && event.key !== DAY_RECORDS_STORAGE_KEY) {
				return
			}

			refreshDatesWithContent()
		}

		const handleDayRecordChange = () => {
			refreshDatesWithContent()
		}

		window.addEventListener("storage", handleStorageChange)
		window.addEventListener(DAY_RECORDS_CHANGED_EVENT, handleDayRecordChange)

		return () => {
			window.removeEventListener("storage", handleStorageChange)
			window.removeEventListener(DAY_RECORDS_CHANGED_EVENT, handleDayRecordChange)
		}
	}, [refreshDatesWithContent])

	const handleOnSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate)

		if (!selectedDate) {
			return
		}

		router.push(`/day/${toDayId(selectedDate)}`)
	}

	return (
		<Card className="mx-auto w-fit max-w-75" size="sm">
			<CardContent>
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleOnSelect}
					month={currentMonth}
					onMonthChange={setCurrentMonth}
					fixedWeeks
					className="p-0 [--cell-size:--spacing(9.5)]"
					modifiers={{ hasContent: datesWithContent }}
				/>
			</CardContent>
			<CardFooter className="flex flex-wrap gap-2 border-t">
				{[
					{ label: "Today", value: 0 },
				].map((preset) => (
					<Button
						key={preset.value}
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => {
							const newDate = addDays(new Date(), preset.value)
							setDate(newDate)
							setCurrentMonth(
								new Date(newDate.getFullYear(), newDate.getMonth(), 1)
							)
						}}
					>
						{preset.label}
					</Button>
				))}
			</CardFooter>
		</Card>
	)
}
