"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { addDays } from "date-fns"

export const CalendarWithPresets = () => {
	const [date, setDate] = React.useState<Date | undefined>(
		new Date(new Date().getFullYear(), 1, 12)
	)
	const [currentMonth, setCurrentMonth] = React.useState<Date>(
		new Date(new Date().getFullYear(), new Date().getMonth(), 1)
	)

	const handleOnSelect = (selectedDate: Date | undefined) => {
		console.log('selectedDate :>> ', selectedDate);

		setDate(selectedDate)
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
