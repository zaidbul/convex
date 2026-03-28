import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Filter,
  Folder,
  Laptop,
  MapPin,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  Tag,
  User,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/search-filter")({
  component: SearchFilterPage,
});

// ============================================================================
// EXAMPLE 1: Basic Combobox / Autocomplete
// ============================================================================

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "in", label: "India" },
  { value: "mx", label: "Mexico" },
];

function ComboboxAutocomplete() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combobox / Autocomplete</CardTitle>
        <CardDescription>Search and select from a list with typeahead filtering</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select a country</Label>
          <Combobox value={value} onValueChange={setValue}>
            <ComboboxInput
              placeholder="Search countries..."
              showClear
              className="w-full max-w-sm"
            />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxEmpty>No country found.</ComboboxEmpty>
                {countries.map((country) => (
                  <ComboboxItem key={country.value} value={country.value}>
                    {country.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {value && (
            <p className="text-sm text-on-surface-variant">
              Selected: {countries.find((c) => c.value === value)?.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 2: Multi-select with Tags
// ============================================================================

const skills = [
  { value: "react", label: "React", icon: Laptop },
  { value: "typescript", label: "TypeScript", icon: Laptop },
  { value: "nodejs", label: "Node.js", icon: Laptop },
  { value: "python", label: "Python", icon: Laptop },
  { value: "rust", label: "Rust", icon: Laptop },
  { value: "go", label: "Go", icon: Laptop },
  { value: "aws", label: "AWS", icon: Laptop },
  { value: "docker", label: "Docker", icon: Laptop },
];

function MultiSelectWithTags() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["react", "typescript"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-select with Tags</CardTitle>
        <CardDescription>Select multiple options displayed as removable tags</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select your skills</Label>
          <MultiSelect
            options={skills}
            defaultValue={selectedSkills}
            onValueChange={setSelectedSkills}
            placeholder="Select skills..."
            maxCount={4}
            className="max-w-lg"
          />
        </div>

        {/* Combobox Chips variant */}
        <Separator />
        <div className="space-y-2">
          <Label>Combobox Chips variant</Label>
          <ComboboxChipsMultiSelect />
        </div>
      </CardContent>
    </Card>
  );
}

function ComboboxChipsMultiSelect() {
  const [values, setValues] = useState<string[]>(["react", "typescript"]);
  const anchorRef = useComboboxAnchor();

  return (
    <Combobox multiple value={values} onValueChange={setValues}>
      <ComboboxChips ref={anchorRef} className="max-w-lg">
        {values.map((value) => (
          <ComboboxChip key={value}>{skills.find((s) => s.value === value)?.label}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder="Add skills..." />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxList>
          <ComboboxEmpty>No skill found.</ComboboxEmpty>
          {skills.map((skill) => (
            <ComboboxItem key={skill.value} value={skill.value}>
              {skill.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

// ============================================================================
// EXAMPLE 3: Faceted Search
// ============================================================================

const facets = {
  category: [
    { value: "electronics", label: "Electronics", count: 234 },
    { value: "clothing", label: "Clothing", count: 187 },
    { value: "books", label: "Books", count: 156 },
    { value: "home", label: "Home & Garden", count: 89 },
    { value: "sports", label: "Sports", count: 67 },
  ],
  brand: [
    { value: "apple", label: "Apple", count: 45 },
    { value: "samsung", label: "Samsung", count: 38 },
    { value: "sony", label: "Sony", count: 29 },
    { value: "nike", label: "Nike", count: 52 },
    { value: "adidas", label: "Adidas", count: 41 },
  ],
  price: [
    { value: "0-50", label: "Under $50", count: 123 },
    { value: "50-100", label: "$50 - $100", count: 89 },
    { value: "100-200", label: "$100 - $200", count: 67 },
    { value: "200+", label: "Over $200", count: 45 },
  ],
  rating: [
    { value: "4+", label: "4+ Stars", count: 156 },
    { value: "3+", label: "3+ Stars", count: 234 },
    { value: "2+", label: "2+ Stars", count: 289 },
  ],
};
const facetKeys = ["category", "brand", "price", "rating"] as const;
type FacetKey = (typeof facetKeys)[number];

function FacetedSearch() {
  const [selectedFacets, setSelectedFacets] = useState<Record<FacetKey, string[]>>({
    category: [],
    brand: [],
    price: [],
    rating: [],
  });

  const toggleFacet = (facetKey: FacetKey, value: string) => {
    setSelectedFacets((prev) => ({
      ...prev,
      [facetKey]: prev[facetKey].includes(value)
        ? prev[facetKey].filter((v) => v !== value)
        : [...prev[facetKey], value],
    }));
  };

  const totalSelected = Object.values(selectedFacets).flat().length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faceted Search</CardTitle>
        <CardDescription>Filter results by multiple dimensions with counts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Facet Sidebar */}
          <div className="w-64 shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filters</span>
              {totalSelected > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedFacets({
                      category: [],
                      brand: [],
                      price: [],
                      rating: [],
                    })
                  }
                >
                  Clear all
                </Button>
              )}
            </div>

            {facetKeys.map((key) => (
              <Collapsible key={key} defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium capitalize hover:text-foreground text-foreground/80">
                  {key}
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pb-4 pt-2">
                    {facets[key].map((facet) => (
                      <label
                        key={facet.value}
                        className="flex cursor-pointer items-center justify-between text-sm hover:text-foreground text-on-surface-variant"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedFacets[key].includes(facet.value)}
                            onCheckedChange={() => toggleFacet(key, facet.value)}
                          />
                          <span>{facet.label}</span>
                        </div>
                        <span className="text-xs text-on-surface-variant">({facet.count})</span>
                      </label>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          <Separator orientation="vertical" className="h-auto" />

          {/* Results Area */}
          <div className="flex-1 min-h-[300px]">
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              {totalSelected > 0 ? (
                <>
                  <span className="text-sm text-on-surface-variant">Active filters:</span>
                  {facetKeys.map((key) =>
                    selectedFacets[key].map((value) => {
                      const facet = facets[key].find((f) => f.value === value);
                      return (
                        <Badge
                          key={`${key}-${value}`}
                          variant="secondary"
                          className="gap-1 cursor-pointer"
                        >
                          {facet?.label}
                          <X className="h-3 w-3" onClick={() => toggleFacet(key, value)} />
                        </Badge>
                      );
                    }),
                  )}
                </>
              ) : (
                <span className="text-sm text-on-surface-variant">
                  No filters applied. Showing all 733 results.
                </span>
              )}
            </div>
            <div className="rounded-md bg-surface-high p-8 text-center text-on-surface-variant">
              <Filter className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Search results would appear here</p>
              {totalSelected > 0 && (
                <p className="text-sm mt-1">Filtered by {totalSelected} criteria</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 4: Filter Chips
// ============================================================================

const filterChipOptions = [
  { id: "all", label: "All", icon: null },
  { id: "active", label: "Active", icon: Check },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "archived", label: "Archived", icon: Folder },
  { id: "starred", label: "Starred", icon: Star },
  { id: "recent", label: "Recent", icon: Calendar },
];

function FilterChips() {
  const [selectedChip, setSelectedChip] = useState("all");
  const [multiChips, setMultiChips] = useState<string[]>(["design", "frontend"]);

  const tagOptions = [
    { id: "design", label: "Design", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    {
      id: "frontend",
      label: "Frontend",
      color: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    {
      id: "backend",
      label: "Backend",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    {
      id: "devops",
      label: "DevOps",
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
    { id: "mobile", label: "Mobile", color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
  ];

  const toggleTag = (id: string) => {
    setMultiChips((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Chips</CardTitle>
        <CardDescription>Quick toggle filters for common categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Single Selection Chips */}
        <div className="space-y-2">
          <Label>Status (single selection)</Label>
          <div className="flex flex-wrap gap-2">
            {filterChipOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedChip === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedChip(option.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-high hover:text-foreground",
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Multi Selection Tag Chips */}
        <div className="space-y-2">
          <Label>Tags (multi-selection)</Label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const isSelected = multiChips.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                    isSelected
                      ? tag.color
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-high",
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {tag.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-on-surface-variant">
            Selected: {multiChips.length > 0 ? multiChips.join(", ") : "None"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 5: Search Suggestions Dropdown
// ============================================================================

const searchSuggestions = {
  recent: ["React hooks", "TypeScript generics", "CSS Grid layout"],
  popular: ["JavaScript async/await", "Node.js REST API", "GraphQL basics"],
  trending: ["AI in web development", "Edge computing", "Web3 tutorials"],
};

const quickLinks = [
  { icon: User, label: "Users", path: "/users" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Folder, label: "Projects", path: "/projects" },
  { icon: Tag, label: "Tags", path: "/tags" },
];

function SearchSuggestionsDropdown() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(searchSuggestions.recent);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    return [
      ...searchSuggestions.recent,
      ...searchSuggestions.popular,
      ...searchSuggestions.trending,
    ].filter((s) => s.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleSearch = (value: string) => {
    if (value && !recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev.slice(0, 2)]);
    }
    setSearchQuery(value);
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Suggestions Dropdown</CardTitle>
        <CardDescription>
          Search input with suggestions, recent searches, and quick links
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-md">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger render={<div className="w-full" />}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  placeholder="Search documentation..."
                  className="pl-9 pr-4"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--anchor-width)] p-0"
              align="start"
              initialFocus={false}
            >
              {filteredSuggestions && filteredSuggestions.length > 0 ? (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-medium text-on-surface-variant">
                    Suggestions
                  </p>
                  {filteredSuggestions.slice(0, 5).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-container"
                    >
                      <Search className="h-3.5 w-3.5 text-on-surface-variant" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Recent Searches */}
                  <div className="p-2">
                    <p className="px-2 py-1.5 text-xs font-medium text-on-surface-variant">
                      Recent searches
                    </p>
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-container"
                      >
                        <Clock className="h-3.5 w-3.5 text-on-surface-variant" />
                        {search}
                      </button>
                    ))}
                  </div>

                  <Separator />

                  {/* Quick Links */}
                  <div className="p-2">
                    <p className="px-2 py-1.5 text-xs font-medium text-on-surface-variant">
                      Quick links
                    </p>
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <button
                          key={link.path}
                          onClick={() => setIsOpen(false)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-container"
                        >
                          <Icon className="h-3.5 w-3.5 text-on-surface-variant" />
                          {link.label}
                        </button>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Trending */}
                  <div className="p-2">
                    <p className="px-2 py-1.5 text-xs font-medium text-on-surface-variant">
                      Trending
                    </p>
                    {searchSuggestions.trending.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSearch(item)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-container"
                      >
                        <Star className="h-3.5 w-3.5 text-on-surface-variant" />
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 6: Advanced Filters Panel
// ============================================================================

function AdvancedFiltersPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "last-30",
    minPrice: 0,
    maxPrice: 1000,
    location: "",
    categories: [] as string[],
    verified: false,
    premium: false,
    sortBy: "relevance",
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.dateRange !== "last-30") count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000) count++;
    if (filters.location) count++;
    if (filters.categories.length > 0) count++;
    if (filters.verified) count++;
    if (filters.premium) count++;
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      status: "all",
      dateRange: "last-30",
      minPrice: 0,
      maxPrice: 1000,
      location: "",
      categories: [],
      verified: false,
      premium: false,
      sortBy: "relevance",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Filters Panel</CardTitle>
        <CardDescription>Comprehensive filtering with multiple input types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter Trigger Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <Input placeholder="Search..." className="pl-9" />
            </div>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger
                render={
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                }
              />
              <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4 bg-surface-container rounded-t-md">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Filters</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      disabled={activeFilterCount === 0}
                    >
                      Reset all
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <RadioGroup
                      value={filters.status}
                      onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
                      className="flex flex-wrap gap-2"
                    >
                      {["all", "active", "pending", "completed"].map((status) => (
                        <Label
                          key={status}
                          className={cn(
                            "flex items-center gap-2 rounded-full px-3 py-1.5 cursor-pointer text-sm capitalize",
                            filters.status === status
                              ? "bg-primary/10"
                              : "bg-surface-container hover:bg-surface-high",
                          )}
                        >
                          <RadioGroupItem value={status} className="sr-only" />
                          {status}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(v) =>
                        setFilters((f) => ({ ...f, dateRange: v ?? f.dateRange }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="last-7">Last 7 days</SelectItem>
                        <SelectItem value="last-30">Last 30 days</SelectItem>
                        <SelectItem value="last-90">Last 90 days</SelectItem>
                        <SelectItem value="all-time">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <div className="pt-2">
                      <Slider
                        value={[filters.minPrice, filters.maxPrice]}
                        onValueChange={(value) => {
                          const [min, max] = value as number[];
                          setFilters((f) => ({
                            ...f,
                            minPrice: min,
                            maxPrice: max,
                          }));
                        }}
                        max={1000}
                        step={10}
                      />
                      <div className="flex justify-between mt-2 text-sm text-on-surface-variant">
                        <span>${filters.minPrice}</span>
                        <span>${filters.maxPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                      <Input
                        value={filters.location}
                        onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                        placeholder="Enter location..."
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <MultiSelect
                      options={[
                        { value: "tech", label: "Technology" },
                        { value: "design", label: "Design" },
                        { value: "marketing", label: "Marketing" },
                        { value: "sales", label: "Sales" },
                        { value: "support", label: "Support" },
                      ]}
                      defaultValue={filters.categories}
                      onValueChange={(v) => setFilters((f) => ({ ...f, categories: v }))}
                      placeholder="Select categories..."
                      maxCount={2}
                    />
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="verified" className="cursor-pointer">
                        Verified only
                      </Label>
                      <Switch
                        id="verified"
                        checked={filters.verified}
                        onCheckedChange={(v) => setFilters((f) => ({ ...f, verified: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="premium" className="cursor-pointer">
                        Premium listings
                      </Label>
                      <Switch
                        id="premium"
                        checked={filters.premium}
                        onCheckedChange={(v) => setFilters((f) => ({ ...f, premium: v }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-container rounded-b-md flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Select
              value={filters.sortBy}
              onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v ?? f.sortBy }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-on-surface-variant">Active:</span>
              {filters.status !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((f) => ({ ...f, status: "all" }))}
                  />
                </Badge>
              )}
              {filters.verified && (
                <Badge variant="secondary" className="gap-1">
                  Verified
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((f) => ({ ...f, verified: false }))}
                  />
                </Badge>
              )}
              {filters.premium && (
                <Badge variant="secondary" className="gap-1">
                  Premium
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((f) => ({ ...f, premium: false }))}
                  />
                </Badge>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <Badge variant="secondary" className="gap-1">
                  ${filters.minPrice} - ${filters.maxPrice}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((f) => ({ ...f, minPrice: 0, maxPrice: 1000 }))}
                  />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="gap-1">
                  {filters.location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((f) => ({ ...f, location: "" }))}
                  />
                </Badge>
              )}
              {filters.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1 capitalize">
                  {cat}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        categories: f.categories.filter((c) => c !== cat),
                      }))
                    }
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 7: Saved / Preset Filters
// ============================================================================

type FilterPreset = {
  id: string;
  name: string;
  icon: LucideIcon;
  filters: Record<string, string>;
};

const presetFilters: FilterPreset[] = [
  {
    id: "my-team",
    name: "My Team",
    icon: User,
    filters: { assignee: "me", status: "active" },
  },
  {
    id: "high-priority",
    name: "High Priority",
    icon: Star,
    filters: { priority: "high", status: "active" },
  },
  {
    id: "due-soon",
    name: "Due This Week",
    icon: Calendar,
    filters: { dueDate: "this-week" },
  },
  {
    id: "recently-updated",
    name: "Recently Updated",
    icon: Clock,
    filters: { updatedAt: "last-24h" },
  },
];

function SavedPresetFilters() {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [savedFilters, setSavedFilters] = useState<FilterPreset[]>([
    {
      id: "custom-1",
      name: "Q4 Projects",
      icon: Bookmark,
      filters: { quarter: "q4", type: "project" },
    },
    {
      id: "custom-2",
      name: "Bug Fixes",
      icon: Tag,
      filters: { type: "bug", status: "open" },
    },
  ]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");

  const handleSaveFilter = () => {
    if (newFilterName.trim()) {
      setSavedFilters((prev) => [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          name: newFilterName,
          icon: Bookmark,
          filters: {},
        },
      ]);
      setNewFilterName("");
      setIsSaveDialogOpen(false);
    }
  };

  const handleDeleteFilter = (id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    if (activePreset === id) setActivePreset(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved / Preset Filters</CardTitle>
        <CardDescription>Quick access to commonly used filter combinations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Filters */}
        <div className="space-y-2">
          <Label>Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            {presetFilters.map((preset) => {
              const Icon = preset.icon;
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(isActive ? null : preset.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-high hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Saved Custom Filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Saved Filters</Label>
            <Popover open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <PopoverTrigger
                render={
                  <Button variant="ghost" size="sm">
                    Save current
                  </Button>
                }
              />
              <PopoverContent className="w-72" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Filter name</Label>
                    <Input
                      value={newFilterName}
                      onChange={(e) => setNewFilterName(e.target.value)}
                      placeholder="Enter a name..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsSaveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleSaveFilter}
                      disabled={!newFilterName.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            {savedFilters.length === 0 ? (
              <p className="text-sm text-on-surface-variant py-4 text-center">
                No saved filters yet. Apply some filters and save them for quick access.
              </p>
            ) : (
              savedFilters.map((filter) => {
                const Icon = filter.icon;
                const isActive = activePreset === filter.id;
                return (
                  <div
                    key={filter.id}
                    className={cn(
                      "flex items-center justify-between rounded-md p-3 transition-all",
                      isActive ? "bg-primary/5" : "bg-surface-high hover:bg-surface-highest",
                    )}
                  >
                    <button
                      onClick={() => setActivePreset(isActive ? null : filter.id)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <Icon className="h-4 w-4 text-on-surface-variant" />
                      <span className="text-sm font-medium">{filter.name}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteFilter(filter.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {activePreset && (
          <div className="rounded-md bg-surface-high p-4 text-center">
            <p className="text-sm text-on-surface-variant">
              Filter "{[...presetFilters, ...savedFilters].find((f) => f.id === activePreset)?.name}
              " is active
            </p>
            <Button variant="link" size="sm" onClick={() => setActivePreset(null)}>
              Clear filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function SearchFilterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-display font-bold tracking-tight">Search & Filtering Patterns</h1>
          <p className="text-on-surface-variant mt-1">
            Components for searching, filtering, and refining data
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="py-8 px-8 space-y-16">
        <ComboboxAutocomplete />
        <MultiSelectWithTags />
        <FacetedSearch />
        <FilterChips />
        <SearchSuggestionsDropdown />
        <AdvancedFiltersPanel />
        <SavedPresetFilters />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
