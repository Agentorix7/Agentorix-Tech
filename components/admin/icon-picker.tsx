"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Common lucide-react icons for services
const commonIcons = [
  "Bot", "Server", "Code", "Code2", "Globe", "Cloud", "Shield", "TrendingUp",
  "Users", "UserPlus", "MessageSquare", "Palette", "PenTool", "FileText", "Target",
  "Megaphone", "Briefcase", "Monitor", "Search", "Smartphone", "Database",
  "Layers", "Zap", "Settings", "Rocket", "Star", "Heart", "Lightbulb",
  "Puzzle", "Gift", "Award", "Trophy", "CheckCircle", "ArrowRight",
  "Home", "Building", "Store", "ShoppingCart", "CreditCard", "DollarSign",
  "BarChart", "LineChart", "PieChart", "Activity", "Mail", "Phone", "Video",
  "Camera", "Image", "File", "Folder", "Download", "Upload", "Share",
  "Link", "ExternalLink", "Lock", "Unlock", "Eye", "Bell", "Calendar",
  "Clock", "Timer", "Play", "Pause", "Volume", "Music", "Headphones",
  "Mic", "Radio", "Tv", "Laptop", "Tablet", "Mouse", "Keyboard",
  "Wifi", "Bluetooth", "Signal", "Map", "MapPin", "Navigation", "Compass",
  "Flag", "Globe2", "Earth", "Sun", "Moon", "CloudRain", "CloudSnow",
  "Droplet", "Flame", "Check", "AlertCircle", "Info", "HelpCircle",
  "RefreshCw", "Copy", "Clipboard", "Send", "Package", "Box", "Truck",
  "Car", "Plane", "Ship", "Train", "Bus"
];

type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
  label?: string;
  description?: string;
};

export function IconPicker({ value, onChange, label, description }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = commonIcons.filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  const IconComponent = value ? (LucideIcons[value as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) : null;

  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
          >
            {IconComponent ? (
              <>
                <IconComponent className="h-4 w-4 mr-2" />
                <span>{value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select an icon</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="p-2 max-h-[300px] overflow-y-auto grid grid-cols-4 gap-2">
            {filteredIcons.map((iconName) => {
              const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
              if (!Icon) return null;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`p-2 rounded-lg border transition-colors ${
                    value === iconName
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted border-border"
                  }`}
                  title={iconName}
                >
                  <Icon className="h-5 w-5 mx-auto" />
                </button>
              );
            })}
          </div>
          {value && (
            <div className="p-2 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Selected: {value}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

