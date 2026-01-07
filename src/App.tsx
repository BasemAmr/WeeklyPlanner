import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Plus, List, LayoutGrid } from 'lucide-react'
import { Button } from '@/design-system/components'
import { DayColumn, DayPicker, SliderModeToggle } from '@/features/week-planner'
import { FieldListView, ImportExportPanel, SettingsModal, Onboarding } from '@/shared/components'
import { useWeekData, useWeekSlider } from '@/features/week-planner'
import { useSettings } from '@/contexts/SettingsContext'
import { Day, FieldList, SliderMode } from '@/shared/types'
import { cn } from '@/lib/utils'

function App() {
  const [viewMode, setViewMode] = useState<'week' | 'lists'>('week')
  const [sliderMode, setSliderMode] = useState<SliderMode>('horizontal')
  const { isSetupComplete } = useSettings()

  const {
    weekData,
    loading,
    weekRange,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    addEntry,
    toggleEntry,
    updateEntry,
    deleteEntry,
    changeEntryColor,
    refresh,
    // Field List methods
    addFieldList,
    deleteFieldList,
    updateFieldListTitle,
    addFieldListEntry,
    toggleFieldListEntry,
    updateFieldListEntry,
    deleteFieldListEntry,
    changeFieldListEntryColor
  } = useWeekData()

  const { emblaRef, scrollTo, selectedIndex } = useWeekSlider(0, sliderMode)

  // Auto-scroll to today when week changes
  useEffect(() => {
    if (weekData) {
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

      const todayIndex = weekData.days.findIndex((d: Day) => d.date === todayStr)
      if (todayIndex !== -1) {
        scrollTo(todayIndex)
      } else {
        scrollTo(0)
      }
    }
  }, [weekData?.weekId, scrollTo])

  if (loading || !weekData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-neutral-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }
  if (!isSetupComplete) {
    return <Onboarding />
  }

  return (
    <div className="layout-container" dir="rtl">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-transparent to-transparent" />

      {/* Header */}
      <header className="layout-header">
        <div className="max-w-[1920px] mx-auto">
          {/* Top Bar */}
          <div className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 border-b border-neutral-50/50">
            <div className="flex items-center justify-between md:justify-start md:gap-6 w-full md:w-auto">
              <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                مخطط الأسبوع
              </h1>

              <div className="flex bg-neutral-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('week')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[40px]",
                    viewMode === 'week' ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  <LayoutGrid className="h-5 w-5" />
                  <span className="hidden sm:inline">الأسبوع</span>
                </button>
                <button
                  onClick={() => setViewMode('lists')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[40px]",
                    viewMode === 'lists' ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  <List className="h-5 w-5" />
                  <span className="hidden sm:inline">قوائم إضافية</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-1.5 md:gap-2 w-full md:w-auto">
              {/* Navigation Controls */}
              <div className="flex items-center justify-center flex-1 md:flex-none bg-neutral-50 rounded-lg border border-neutral-200 p-1 mx-1 md:mx-2 min-w-0">
                <Button variant="ghost" size="icon" className="btn-touch h-8 w-8 min-h-[32px] min-w-[32px]" onClick={goToPreviousWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="text-center px-1 sm:px-4 min-w-[100px] sm:min-w-[160px] truncate">
                  <p className="text-[10px] sm:text-xs font-medium text-neutral-400">{new Date().getFullYear()}</p>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{weekRange}</p>
                </div>
                <Button variant="ghost" size="icon" className="btn-touch h-8 w-8 min-h-[32px] min-w-[32px]" onClick={goToNextWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="sm" onClick={goToToday} className="gap-2 h-10 px-3 md:h-11 md:px-4 border-dashed">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">اليوم</span>
                </Button>

                <ImportExportPanel currentWeek={weekData} onImportComplete={refresh} />
                <SettingsModal />
              </div>
            </div>
          </div>

          {/* Day Picker (Only visible in week view) */}
          {viewMode === 'week' && (
            <div className="w-full bg-white/50 border-t border-neutral-100">
              <DayPicker
                days={weekData.days}
                selectedIndex={selectedIndex}
                onDaySelect={scrollTo}
                className="max-w-[1920px] mx-auto"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="layout-main">
        {viewMode === 'week' ? (
          <div className={cn("embla h-full", sliderMode === 'vertical' ? 'embla--vertical' : 'embla--horizontal')} ref={emblaRef}>
            <div className={cn(
              "embla__container h-full p-4 md:px-8",
              sliderMode === 'vertical' ? "gap-0" : "gap-4 md:gap-6"
            )}>
              {weekData.days.map((day: Day, index: number) => (
                <DayColumn
                  key={day.date}
                  day={day}
                  onAddEntry={addEntry}
                  onToggleEntry={toggleEntry}
                  onUpdateEntry={updateEntry}
                  onDeleteEntry={deleteEntry}
                  onColorChange={changeEntryColor}
                  onSelect={() => scrollTo(index )}
                  isHighlighted={index === selectedIndex}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Field Lists View (Horizontal scroll only for now) */
          <div className="w-full h-full overflow-x-auto dreamy-scroll flex items-start gap-4 p-4 md:px-8">
            {weekData.fieldLists?.map((list: FieldList) => (
              <FieldListView
                key={list.id}
                list={list}
                onUpdateTitle={updateFieldListTitle}
                onDeleteList={deleteFieldList}
                onAddEntry={addFieldListEntry}
                onToggleEntry={toggleFieldListEntry}
                onUpdateEntry={updateFieldListEntry}
                onDeleteEntry={deleteFieldListEntry}
                onColorChange={changeFieldListEntryColor}
              />
            ))}
            <div className="w-full sm:w-[280px] sm:min-w-[200px] flex-shrink-0 flex flex-col p-6 border-2 border-dashed border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors h-[50vh] justify-center items-center cursor-pointer"
              onClick={() => addFieldList("قائمة جديدة")}>
              <Plus className="h-8 w-8 text-neutral-400 mb-2" />
              <span className="text-neutral-500 font-medium">إضافة قائمة جديدة</span>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Slider Mode Toggle */}
      {viewMode === 'week' && (
        <SliderModeToggle mode={sliderMode} onModeChange={setSliderMode} />
      )}
    </div>
  )
}

export default App
