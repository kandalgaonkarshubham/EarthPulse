import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { useFilterContext } from "@/context/Filter";

export default function FilterDrawer({ drawer, toggleDrawer }) {
  const {
    magnitudeFilter,
    setMagnitudeFilter,
    magnitudeTypeFilter,
    setMagnitudeTypeFilter,
    significanceFilter,
    setSignificanceFilter,
    tsunamiFilter,
    setTsunamiFilter,
    statusFilter,
    setStatusFilter,
    alertFilter,
    setAlertFilter,
    resetFilters,
  } = useFilterContext();
  return (
    <Drawer
      open={drawer}
      onOpenChange={toggleDrawer}
      direction="right"
      className="flex flex-col align-center justify-center"
    >
      <DrawerContent className="absolute top-[1%] right-[1%] mmax-w-[40vw] h-[98vh] bg-secondary text-white after:!w-0">
        <div className="w-full h-full flex flex-col gap-2 mx-6 mr-10 my-4">
          <h4 className="text-start text-3xl font-Syne my-8">Filters</h4>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <p className="font-Syne">Magnitude </p>
              <Select onValueChange={setMagnitudeFilter}>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder={magnitudeFilter || "Any"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-Syne">Type </p>
              <Select onValueChange={setMagnitudeTypeFilter}>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder={magnitudeTypeFilter || "Any"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="md">md</SelectItem>
                  <SelectItem value="mb">mb</SelectItem>
                  <SelectItem value="mww">mww</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <hr className="border-neutral-700 mt-6 mb-4" />
          <div className="flex items-center justify-between gap-2">
            <p className="font-Syne">Significance </p>
            <Select onValueChange={setSignificanceFilter}>
              <SelectTrigger className="max-w-[180px]">
                <SelectValue placeholder={significanceFilter || "Any"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-100">0 - 100</SelectItem>
                <SelectItem value="100-200">100 - 200</SelectItem>
                <SelectItem value="200-300">200 - 300</SelectItem>
                <SelectItem value="300-400">300 - 400</SelectItem>
                <SelectItem value="400-500">400 - 500</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <hr className="border-neutral-700 mt-6 mb-4" />
          <div className="flex items-center justify-between gap-2">
            <p className="font-Syne">Tsunami </p>
            <Checkbox
              checked={tsunamiFilter != null}
              onCheckedChange={(e) => {
                e ? setTsunamiFilter(1) : setTsunamiFilter(null);
              }}
            />
          </div>
          <hr className="border-neutral-700 mt-6 mb-4" />
          <div className="flex items-center justify-between gap-2">
            <p className="font-Syne">Status </p>
            <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-[180px]">
                <SelectValue placeholder={statusFilter || "Any"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <hr className="border-neutral-700 mt-6 mb-4" />
          <div className="flex items-center justify-between gap-2">
            <p className="font-Syne">Alert </p>
            <Select onValueChange={setAlertFilter}>
              <SelectTrigger className="max-w-[180px]">
                <SelectValue placeholder={alertFilter || "Any"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="green"
                  className="text-emerald-500 uppercase"
                >
                  Green
                </SelectItem>
                <SelectItem
                  value="yellow"
                  className="text-yellow-500 uppercase"
                >
                  Yellow
                </SelectItem>
                <SelectItem
                  value="orange"
                  className="text-orange-500 uppercase"
                >
                  Orange
                </SelectItem>
                <SelectItem value="red" className="text-rose-500 uppercase">
                  Red
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            className="border border-neutral-600 font-Syne uppercase rounded-lg p-2 mt-8"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
