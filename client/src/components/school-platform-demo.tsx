import { useState } from 'react';
import { BookOpen, CalendarDays, ClipboardList, GraduationCap, LayoutDashboard, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const schoolPages = {
  Welcome: {
    title: 'Learn today. Build tomorrow.',
    description: 'Horizon Technical Academy combines general education with practical training in agriculture, carpentry and electrical installation.',
    items: ['Junior and senior secondary', 'Hands-on workshops', 'Student and family support'],
  },
  Programs: {
    title: 'Programs for practical careers',
    description: 'Each department can display its own course offerings, entry requirements and qualifications.',
    items: ['Agriculture and crop production', 'Carpentry and woodworking', 'Electrical installation'],
  },
  Admissions: {
    title: 'Plan your application',
    description: 'Families can review admission requirements, learn about entrance examinations and follow the school’s application steps.',
    items: ['Review requirements', 'Prepare application documents', 'Check entrance exam dates'],
  },
};

const workspaceViews = {
  Admissions: {
    icon: ClipboardList,
    description: 'Staff follow each application from submission through review and enrollment.',
    columns: ['Sample application', 'Program', 'Status'],
    rows: [
      ['Application 001', 'General education', 'Ready for review'],
      ['Application 002', 'Electrical installation', 'Exam scheduled'],
      ['Application 003', 'Carpentry', 'Accepted'],
    ],
  },
  Attendance: {
    icon: CalendarDays,
    description: 'Teachers record attendance by class, and school leaders can review totals.',
    columns: ['Class', 'Present', 'Absent'],
    rows: [['Grade 7', '24', '2'], ['Grade 8', '21', '1'], ['Electrical Installation 1', '17', '1']],
  },
  'Programs & TVET': {
    icon: Wrench,
    description: 'School staff organize technical departments, qualifications and learning groups.',
    columns: ['Department', 'Qualification', 'Group'],
    rows: [
      ['Agriculture', 'Certificate', 'Year 1'],
      ['Carpentry', 'Certificate', 'Year 2'],
      ['Electrical installation', 'Certificate', 'Year 1'],
    ],
  },
};

type SchoolPage = keyof typeof schoolPages;
type WorkspaceView = keyof typeof workspaceViews;

interface SchoolPlatformDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequest: () => void;
  requestLabel?: string;
}

export default function SchoolPlatformDemo({ open, onOpenChange, onRequest, requestLabel = "Request a school solution" }: SchoolPlatformDemoProps) {
  const [view, setView] = useState<'website' | 'workspace'>('website');
  const [schoolPage, setSchoolPage] = useState<SchoolPage>('Welcome');
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('Admissions');
  const page = schoolPages[schoolPage];
  const workspace = workspaceViews[workspaceView];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] overflow-y-auto rounded-xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Explore a sample school</DialogTitle>
          <DialogDescription>
            Horizon Technical Academy is fictional. Explore its public website and sample management workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Demo view">
          <Button variant={view === 'website' ? 'default' : 'outline'} aria-pressed={view === 'website'} onClick={() => setView('website')}>
            <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" /> School website
          </Button>
          <Button variant={view === 'workspace' ? 'default' : 'outline'} aria-pressed={view === 'workspace'} onClick={() => setView('workspace')}>
            <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" /> Management walkthrough
          </Button>
        </div>

        {view === 'website' ? (
          <section className="overflow-hidden rounded-xl border border-teal-200 bg-teal-50 text-slate-900" aria-label="Sample school website">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-teal-950 px-5 py-4 text-white">
              <div className="flex items-center gap-2 font-semibold">
                <GraduationCap className="h-5 w-5 text-amber-300" aria-hidden="true" /> Horizon Technical Academy
              </div>
              <nav className="flex flex-wrap gap-1" aria-label="Sample school pages">
                {(Object.keys(schoolPages) as SchoolPage[]).map(name => (
                  <button key={name} type="button" aria-current={schoolPage === name ? 'page' : undefined}
                    className={`rounded px-2 py-1 text-sm hover:bg-teal-800 ${schoolPage === name ? 'bg-teal-800 font-semibold' : ''}`}
                    onClick={() => setSchoolPage(name)}>{name}</button>
                ))}
              </nav>
            </div>
            <div className="space-y-4 p-5 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">Sample school website</p>
              <h3 className="text-2xl font-bold sm:text-3xl">{page.title}</h3>
              <p className="max-w-2xl leading-relaxed text-slate-700">{page.description}</p>
              <ul className="grid gap-2 sm:grid-cols-3">
                {page.items.map(item => <li key={item} className="rounded-lg border border-teal-100 bg-white p-3 text-sm font-medium">{item}</li>)}
              </ul>
            </div>
          </section>
        ) : (
          <section className="grid overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-slate-900 sm:grid-cols-[10rem_minmax(0,1fr)]" aria-label="Sample management workspace">
            <nav className="space-y-1 bg-slate-900 p-3 text-white" aria-label="Sample management modules">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-teal-300">School office</p>
              {(Object.keys(workspaceViews) as WorkspaceView[]).map(name => {
                const Icon = workspaceViews[name].icon;
                return <button key={name} type="button" aria-pressed={workspaceView === name}
                  className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-slate-700 ${workspaceView === name ? 'bg-slate-700 font-semibold' : ''}`}
                  onClick={() => setWorkspaceView(name)}><Icon className="h-4 w-4 shrink-0" aria-hidden="true" />{name}</button>;
              })}
            </nav>
            <div className="min-w-0 p-4 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">Fictional records</p>
              <h3 className="mt-2 text-2xl font-bold">{workspaceView}</h3>
              <p className="my-3 text-sm text-slate-700">{workspace.description}</p>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full bg-white text-left text-sm">
                  <caption className="sr-only">{workspaceView} sample records</caption>
                  <thead className="bg-slate-100">
                    <tr>{workspace.columns.map(column => <th key={column} scope="col" className="px-3 py-2">{column}</th>)}</tr>
                  </thead>
                  <tbody>
                    {workspace.rows.map(row => <tr key={row[0]} className="border-t border-slate-200">{row.map((cell, index) => <td key={index} className="px-3 py-2">{cell}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">TOTAG can adapt the branding, programs and workflows for your institution.</p>
          <Button onClick={onRequest}>{requestLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
