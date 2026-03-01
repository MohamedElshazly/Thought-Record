import { Button } from "@/components/ui/button"
import { isValidDayId } from "@/lib/day-id"
import { getFormattedDay } from "@/lib/day-records"
import Link from "next/dist/client/link"
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
			</div>

		</main>
	)
}
