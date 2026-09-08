import React from 'react';
import { Farmer } from '../../types';
import { Badge } from '../common/Badge';
import { 
  User, 
  Pencil, 
  Trash2, 
  Phone, 
  MapPin, 
  Maximize2, 
  Sprout, 
  Users, 
  Tag, 
  IndianRupee, 
  Wrench, 
  Package, 
  Droplets 
} from 'lucide-react';

interface FarmerCardProps {
  farmer: Farmer;
  onEdit: (farmer: Farmer) => void;
  onDelete: (farmer: Farmer) => void;
}

export const FarmerCard: React.FC<FarmerCardProps> = ({ farmer, onEdit, onDelete }) => {
  const equipmentNames = farmer.equipment?.map(e => e.equipment_name).join(', ') || 'None';
  const inputNames = farmer.inputs?.map(i => `${i.input_name} (${i.quantity}${i.unit})`).join(', ') || 'None';

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top bar: Avatar & Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100/70 flex items-center justify-center text-emerald-800 font-bold border border-emerald-200/50">
              <User className="w-6 h-6 text-emerald-800" />
            </div>
            <div>
              <div className="mb-1">
                {farmer.is_synthetic ? (
                  <Badge type="synthetic" />
                ) : (
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">FARMER</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-none">{farmer.name}</h3>
              <div className="text-xs text-stone-500 font-medium mt-1">
                <span className="font-semibold text-stone-700">{farmer.id}</span> · {farmer.location}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(farmer)}
              title="Edit Farmer Profile"
              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center border border-emerald-200/60 transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(farmer)}
              title="Delete Farmer Profile"
              className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center border border-rose-200/60 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact details bar */}
        <div className="flex items-center gap-4 text-xs text-stone-600 font-medium mb-4 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-stone-400" />
            <span>{farmer.phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>{farmer.location}</span>
          </div>
        </div>

        {/* 2-column detail grid matching AgriWise screenshot */}
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 mb-4 text-xs">
          {/* Farm Size */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-100/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium leading-none">Farm size</div>
              <div className="font-bold text-stone-800 mt-0.5">{farmer.farm_size} acres</div>
            </div>
          </div>

          {/* Growth Stage */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-100/60 text-teal-700 flex items-center justify-center shrink-0">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium leading-none">Growth stage</div>
              <div className="font-bold text-stone-800 mt-0.5">{farmer.growth_stage}</div>
            </div>
          </div>

          {/* Crop */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-green-100/60 text-green-700 flex items-center justify-center shrink-0">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium leading-none">Crop</div>
              <div className="font-bold text-stone-800 mt-0.5">{farmer.crop}</div>
            </div>
          </div>

          {/* Available Workers */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-100/60 text-sky-700 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium leading-none">Available workers</div>
              <div className="font-bold text-stone-800 mt-0.5">{farmer.workers}</div>
            </div>
          </div>

          {/* Variety */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-100/60 text-purple-700 flex items-center justify-center shrink-0">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium leading-none">Variety</div>
              <div className="font-bold text-stone-800 mt-0.5">{farmer.variety}</div>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-100/60 text-amber-700 flex items-center justify-center shrink-0">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium leading-none">Budget</div>
              <div className="font-bold text-stone-900 mt-0.5">₹ {farmer.budget.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Resource Strip matching screenshot */}
      <div className="bg-[#F8FAFC] border border-stone-200/60 rounded-xl p-3 text-xs space-y-2 mt-2">
        <div className="flex items-center gap-2 text-stone-700">
          <Wrench className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-[11px] text-stone-500 font-medium">Equipment:</span>
          <span className="font-semibold text-stone-800 truncate">{equipmentNames}</span>
        </div>
        <div className="flex items-center gap-2 text-stone-700">
          <Package className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-[11px] text-stone-500 font-medium">Inputs:</span>
          <span className="font-semibold text-stone-800 truncate">{inputNames}</span>
        </div>
        <div className="flex items-center gap-2 text-stone-700">
          <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span className="text-[11px] text-stone-500 font-medium">Water:</span>
          <span className="font-semibold text-stone-800">{farmer.irrigation_available} ({farmer.water_availability})</span>
        </div>
      </div>
    </div>
  );
};
