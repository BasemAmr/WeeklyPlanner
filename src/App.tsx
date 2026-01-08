import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Plus, List, LayoutGrid } from 'lucide-react'
import { Button } from '@/design-system/components'
import { DayColumn, DayPicker, MobileAppControls } from '@/features/week-planner'
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

  // Two separate sliders to maintain state when switching views
  // NOTE: We pass the *external* state setter to sync them
  const daySlider = useWeekSlider(0, sliderMode)
  const listSlider = useWeekSlider(0, sliderMode)

  // Auto-scroll to today when week changes
  useEffect(() => {
    if (weekData) {
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

      const todayIndex = weekData.days.findIndex((d: Day) => d.date === todayStr)
      if (todayIndex !== -1) {
        daySlider.scrollTo(todayIndex)
        // We don't necessarily scroll lists, maybe reset to 0
        listSlider.scrollTo(0)
      } else {
        daySlider.scrollTo(0)
      }
    }
  }, [weekData?.weekId, daySlider.scrollTo, listSlider.scrollTo])

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

      {/* Desktop Header */}
      <header className="hidden md:block layout-header">
        <div className="max-w-[1920px] mx-auto">
          {/* Top Bar */}
          <div className="px-4 py-3 flex items-center justify-between gap-0 border-b border-neutral-50/50">
            <div className="flex items-center justify-start gap-6 w-auto">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
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

            <div className="flex items-center justify-end gap-2 w-auto">
              {/* Navigation Controls */}
              <div className="flex items-center justify-center flex-none bg-neutral-50 rounded-lg border border-neutral-200 p-1 mx-2">
                <Button variant="ghost" size="icon" className="btn-touch h-8 w-8 min-h-[32px] min-w-[32px]" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="text-center px-4 min-w-[160px] truncate">
                  <p className="text-xs font-medium text-neutral-400">{new Date().getFullYear()}</p>
                  <p className="text-sm font-bold text-neutral-900 truncate">{weekRange}</p>
                </div>
                <Button variant="ghost" size="icon" className="btn-touch h-8 w-8 min-h-[32px] min-w-[32px]" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="sm" onClick={goToToday} className="gap-2 h-11 px-4 border-dashed">
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
                days={weekData!.days}
                selectedIndex={daySlider.selectedIndex}
                onDaySelect={daySlider.scrollTo}
                className="max-w-[1920px] mx-auto"
              />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur border-b border-neutral-100 z-50 fixed top-0 left-0 right-0 shadow-sm transition-transform duration-300">
        <Button variant="ghost" size="icon" className="h-10 w-10 active:scale-95 transition-transform" onClick={goToNextWeek}>
          <ChevronRight className="h-5 w-5 text-neutral-600" />
        </Button>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-neutral-900">{weekRange}</span>
          <span className="text-[10px] text-neutral-400 font-medium">{new Date().getFullYear()}</span>
        </div>

        <Button variant="ghost" size="icon" className="h-10 w-10 active:scale-95 transition-transform" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </Button>
      </header>

      {/* Main Content Area */}
      {/* Added extra top padding for mobile to avoid overlap (pt-40) and bottom padding (pb-40) for controls */}
      <main className="layout-main md:pt-0 md:pb-0">

        {/* Week View (Days) */}
        {viewMode === 'week' && (
          <div className={cn("embla h-full pt-16 pb-40 md:py-0", sliderMode === 'vertical' ? 'embla--vertical' : 'embla--horizontal')} ref={daySlider.emblaRef}>
            <div className={cn(
              "embla__container h-full p-4 md:px-8",
              sliderMode === 'vertical' ? "gap-0" : "gap-4 md:gap-6"
            )}>
              {weekData!.days.map((day: Day, index: number) => (
                <DayColumn
                  key={day.date}
                  day={day}
                  onAddEntry={addEntry}
                  onToggleEntry={toggleEntry}
                  onUpdateEntry={updateEntry}
                  onDeleteEntry={deleteEntry}
                  onColorChange={changeEntryColor}
                  onSelect={() => daySlider.scrollTo(index)}
                  isHighlighted={index === daySlider.selectedIndex}
                />
              ))}
            </div>
          </div>
        )}

        {/* Field Lists View - Now also using Embla! */}
        {viewMode === 'lists' && (
          <div className={cn("embla h-full pt-16 pb-40 md:py-0", sliderMode === 'vertical' ? 'embla--vertical' : 'embla--horizontal')} ref={listSlider.emblaRef}>
            <div className={cn(
              "embla__container h-full p-4 md:px-8",
              sliderMode === 'vertical' ? "gap-4 flex-col" : "gap-4 md:gap-6 flex-row"
            )}>
              {/* 
                     Field Lists typically don't take full width in Horizontal mode on desktop?
                     But on mobile they should behave like pages if we want "slider" feel.
                     Or just scrollable cards?
                     If we use Embla, they become slides.
                     Let's wrap each in a slide div width appropriate styles.
                 */}
              {weekData!.fieldLists?.map((list: FieldList, index: number) => (
                <div key={list.id} className="embla__slide flex-none w-full md:w-[25rem] h-full" onClick={() => listSlider.scrollTo(index)}>
                  <FieldListView
                    list={list}
                    onUpdateTitle={updateFieldListTitle}
                    onDeleteList={deleteFieldList}
                    onAddEntry={addFieldListEntry}
                    onToggleEntry={toggleFieldListEntry}
                    onUpdateEntry={updateFieldListEntry}
                    onDeleteEntry={deleteFieldListEntry}
                    onColorChange={changeFieldListEntryColor}
                  />
                </div>
              ))}

              {/* 'New List' Slide */}
              <div className="embla__slide flex-none w-full md:w-[25rem] h-full">
                <div className="w-full h-full flex flex-col p-6 border-2 border-dashed border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors justify-center items-center cursor-pointer"
                  onClick={() => addFieldList("قائمة جديدة")}>
                  <Plus className="h-8 w-8 text-neutral-400 mb-2" />
                  <span className="text-neutral-500 font-medium">إضافة قائمة جديدة</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile App Controls (Slider Toggle + Day/List Picker) */}
      <div className="md:hidden">
        <MobileAppControls
          viewMode={viewMode}
          days={weekData!.days}
          fieldLists={weekData!.fieldLists}
          selectedIndex={viewMode === 'week' ? daySlider.selectedIndex : listSlider.selectedIndex}
          onSelect={viewMode === 'week' ? daySlider.scrollTo : listSlider.scrollTo}
          sliderMode={sliderMode}
          onSliderModeChange={setSliderMode}
          className="bottom-32"
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/90 backdrop-blur-md border border-neutral-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl flex items-center justify-around z-50 px-2 pb-1 safe-area-bottom">
        <button
          onClick={() => setViewMode('week')}
          className={cn("flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors", viewMode === 'week' ? "text-neutral-900" : "text-neutral-400")}
        >
          <LayoutGrid className={cn("h-6 w-6 transition-transform duration-200", viewMode === 'week' ? "scale-110" : "scale-100")} />
          <span className="text-[10px] font-medium">الأسبوع</span>
        </button>

        <button
          onClick={() => setViewMode('lists')}
          className={cn("flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors", viewMode === 'lists' ? "text-neutral-900" : "text-neutral-400")}
        >
          <List className={cn("h-6 w-6 transition-transform duration-200", viewMode === 'lists' ? "scale-110" : "scale-100")} />
          <span className="text-[10px] font-medium">القوائم</span>
        </button>

        <div className="w-px h-8 bg-neutral-200 mx-1" />

        <div className="flex items-center gap-1">
          <div className="scale-90 opacity-80">
            <ImportExportPanel currentWeek={weekData!} onImportComplete={refresh} />
          </div>
          <div className="scale-90 opacity-80">
            <SettingsModal />
          </div>
        </div>
      </nav>

    </div>
  )
}

export default App
