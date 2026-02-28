import { CalendarWithPresets } from "@/components/CalendarView";

export default function Page() {
	return (
		<div className="flex flex-col gap-16 items-center justify-center min-h-screen">
			<div className="flex flex-col gap-2 items-center justify-center">
				<h1 className="text-4xl">Welcome to the Daily Thought Record.</h1>
				<p>Click on a day to add a new thought record.</p>
			</div>
			<CalendarWithPresets />
		</div>
	)
}