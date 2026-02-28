import { DayRecordEditor } from "@/components/DayRecordEditor"
import { isValidDayId } from "@/lib/day-id"
import { notFound } from "next/navigation"

type DayPageProps = {
	params: Promise<{ dayId: string }>
}

export default async function DayPage({ params }: DayPageProps) {
	const { dayId } = await params

	if (!isValidDayId(dayId)) {
		notFound()
	}

	return (
		<main className="min-h-screen">
			<DayRecordEditor dayId={dayId} />
		</main>
	)
}
