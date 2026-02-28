"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { dayIdToDate, type DayId } from "@/lib/day-id"
import {
	DAY_RECORDS_CHANGED_EVENT,
	getDayRecord,
	upsertDayRecord,
} from "@/lib/day-records"

type DayRecordEditorProps = {
	dayId: DayId
}

const getFormattedDay = (dayId: DayId) => {
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

export function DayRecordEditor({ dayId }: DayRecordEditorProps) {
	const [content, setContent] = React.useState("")
	const [updatedAt, setUpdatedAt] = React.useState<string | null>(null)
	const [isLoaded, setIsLoaded] = React.useState(false)
	const [isSaving, setIsSaving] = React.useState(false)

	React.useEffect(() => {
		setIsLoaded(false)
		const existingRecord = getDayRecord(dayId)
		setContent(existingRecord?.content ?? "")
		setUpdatedAt(existingRecord?.updatedAt ?? null)
		setIsLoaded(true)
	}, [dayId])

	const handleSave = () => {
		setIsSaving(true)

		try {
			const updatedRecord = upsertDayRecord(dayId, content)
			setUpdatedAt(updatedRecord.updatedAt)
			window.dispatchEvent(new CustomEvent(DAY_RECORDS_CHANGED_EVENT))
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">Daily thought record</h1>
					<p className="text-muted-foreground text-sm">{getFormattedDay(dayId)}</p>
				</div>
				<Button asChild variant="outline">
					<Link href="/">Back to calendar</Link>
				</Button>
			</div>

			<Card>
				<CardContent className="space-y-3">
					<label htmlFor="day-content" className="text-sm font-medium">
						Thoughts for this day
					</label>
					<Textarea
						id="day-content"
						rows={12}
						value={content}
						onChange={(event) => setContent(event.target.value)}
						placeholder="Write your thoughts for this day..."
						disabled={!isLoaded || isSaving}
					/>
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-xs">
							{updatedAt
								? `Last saved ${new Date(updatedAt).toLocaleString()}`
								: "No saved content yet"}
						</p>
						<Button onClick={handleSave} disabled={!isLoaded || isSaving}>
							{isSaving ? "Saving..." : "Save"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
