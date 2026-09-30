import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Headers
    brandTitle: "CropCompaz",
    brandSubtitle: "Horticulture Portal",
    decisionPortal: "CropCompaz · Horticulture Decision Portal",
    procurementPortal: "CropCompaz · Produce Sourcing & Quality Verification",
    cooperativePortal: "CropCompaz · Cooperative Admin Operations",
    welcomeBack: "Welcome back",
    signOut: "Sign Out",
    languageToggle: "Language",
    
    // Farmer Nav
    navDashboard: "Dashboard",
    navMyFarm: "My Farm",
    navAdvisory: "Advisory",
    navRecommendations: "Recommendations",
    navHarvest: "Harvest",
    navQuality: "Quality",
    navFeedback: "Feedback",
    
    // Buyer Nav
    navProfile: "Profile & Sourcing Details",
    navRequirements: "Requirements",
    navProduce: "Available Produce",
    navQualityInspections: "Quality Inspections",
    navOrders: "Orders / Requests",
    navTraceability: "Traceability",
    navBuyerFeedback: "Quality Feedback",
    
    // Farmer Dashboard & Resources
    farmDashboard: "Farm Dashboard",
    currentCrop: "Current Crop",
    farmSizeLabours: "Farm Size & Labour Force",
    farmSize: "Farm Size",
    availableBudget: "Available Budget",
    irrigationEquip: "Irrigation & Equipment",
    activeAdvisoryRecs: "Active Advisory Recs",
    workersAvailable: "Workers Available",
    farmResourcesConstraints: "Farm Resources & Field Constraints",
    laboursWorkers: "Labour Capacity",
    irrigationMethods: "Irrigation Methods",
    irrigationSetup: "Irrigation Setup",
    availableEquipments: "Available Equipments",
    equipmentInventory: "Equipment Inventory",
    waterAvailability: "Water Availability",
    waterSource: "Water Source",
    soilType: "Soil Type",
    location: "Location",
    growthStage: "Growth Stage",
    temperature: "Temperature",
    rainfall: "Rainfall",
    acres: "Acres",
    persons: "Persons",
    
    // Actions & Buttons
    generateAdvisory: "Generate Farm Advisory",
    viewResources: "View Farm Resources",
    myCropRecs: "My Crop Recommendations",
    viewAllHistory: "View All History",
    whyRecommendation: "Why This Recommendation?",
    evaluateAndAdvise: "Evaluate & Advise",
    evaluatingConstraints: "Evaluating Constraints...",
    primaryRec: "Primary Recommendation",
    alternativeRec: "Alternative Low-Resource Option",
    estimatedCost: "Estimated Cost",
    feasibilityScore: "Feasibility Score",
    evidenceSource: "Evidence Source",
    ruleId: "Rule ID",
    cropTarget: "Active Crop Target",
    updateResources: "Update Farm Resources",
    saveChanges: "Save Changes",
    saving: "Saving...",
    successSave: "Farm resources updated successfully!",
    resourceAwareAdvisory: "Resource-aware advisory for your horticulture crops.",
    evidenceGuidance: "Evidence-backed guidance",
    noRecsYet: "No advisory generated yet for this crop cycle. Click \"Generate Farm Advisory\" above.",
    noEquipment: "No equipment recorded.",
    
    // Statuses
    feasible: "HIGHLY FEASIBLE",
    partial: "PARTIALLY FEASIBLE",
    not_feasible: "NOT FEASIBLE"
  },
  ta: {
    // Brand & Headers
    brandTitle: "CropCompaz",
    brandSubtitle: "தோட்டக்கலை தளம்",
    decisionPortal: "CropCompaz · தோட்டக்கலை ஆலோசனை தளம்",
    procurementPortal: "CropCompaz · கொள்முதல் மற்றும் தர சரிபார்ப்பு",
    cooperativePortal: "CropCompaz · கூட்டுறவு நிர்வாக தளம்",
    welcomeBack: "வணக்கம்",
    signOut: "வெளியேறு",
    languageToggle: "மொழி",
    
    // Farmer Nav
    navDashboard: "டாஷ்போர்டு",
    navMyFarm: "என் பண்ணை வளங்கள்",
    navAdvisory: "பரிந்துரை வழிகாட்டல்",
    navRecommendations: "பரிந்துரை வரலாறு",
    navHarvest: "அறுவடை பதிவுகள்",
    navQuality: "தரம் மற்றும் மதிப்பீடு",
    navFeedback: "கருத்துக்கள்",
    
    // Buyer Nav
    navProfile: "சுயவிவரம் & விவரங்கள்",
    navRequirements: "கொள்முதல் தேவைகள்",
    navProduce: "கிடைக்கும் விளைபொருட்கள்",
    navQualityInspections: "தர ஆய்வுகள்",
    navOrders: "ஆர்டர்கள் / கோரிக்கைகள்",
    navTraceability: "தோற்ற சரிபார்ப்பு",
    navBuyerFeedback: "தர மதிப்பாய்வு",
    
    // Farmer Dashboard & Resources
    farmDashboard: "பண்ணை டாஷ்போர்டு",
    currentCrop: "தற்போதைய பயிர்",
    farmSizeLabours: "பண்ணை அளவு & தொழிலாளர்கள்",
    farmSize: "பண்ணை பரப்பளவு",
    availableBudget: "கையிருப்பு நிதி (பட்ஜெட்)",
    irrigationEquip: "பாசன முறை & கருவிகள்",
    activeAdvisoryRecs: "செயலில் உள்ள பரிந்துரைகள்",
    workersAvailable: "வேலையாட்கள் உள்ளனர்",
    farmResourcesConstraints: "பண்ணை வளங்கள் மற்றும் களக் கட்டுப்பாடுகள்",
    laboursWorkers: "தொழிலாளர் திறன்",
    irrigationMethods: "பாசன முறைகள்",
    irrigationSetup: "பாசன கட்டமைப்பு",
    availableEquipments: "கிடைக்கும் விவசாய உபகரணங்கள்",
    equipmentInventory: "உபகரணங்கள் பட்டியல்",
    waterAvailability: "நீர் இருப்பு நிலை",
    waterSource: "நீர் ஆதாரம்",
    soilType: "மண் வகை",
    location: "பகுதி / கிராமம்",
    growthStage: "பயிர் வளர்ச்சி நிலை",
    temperature: "வெப்பநிலை",
    rainfall: "மழை அளவு",
    acres: "ஏக்கர்",
    persons: "நபர்கள்",
    
    // Actions & Buttons
    generateAdvisory: "பரிந்துரை பெறுக",
    viewResources: "பண்ணை வளங்களை காண்க",
    myCropRecs: "என் பயிருக்கான பரிந்துரைகள்",
    viewAllHistory: "முழு வரலாறு",
    whyRecommendation: "ஏன் இந்த பரிந்துரை?",
    evaluateAndAdvise: "ஆலோசனை பெறுக",
    evaluatingConstraints: "வளங்கள் சரிபார்க்கப்படுகின்றன...",
    primaryRec: "முதன்மை பரிந்துரை",
    alternativeRec: "குறைந்த செலவு மாற்று வழி",
    estimatedCost: "மதிப்பிடப்பட்ட செலவு",
    feasibilityScore: "செயல்படுத்தும் சாத்தியக்கூறு",
    evidenceSource: "ஆதார ஆதாரம்",
    ruleId: "விதி எண்",
    cropTarget: "செயலில் உள்ள பயிர்",
    updateResources: "பண்ணை வளங்களை புதுப்பி",
    saveChanges: "சேமிக்கவும்",
    saving: "சேமிக்கப்படுகிறது...",
    successSave: "பண்ணை வளங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    resourceAwareAdvisory: "உங்கள் கள வளங்களை கருத்தில் கொண்ட துல்லியமான தோட்டக்கலை ஆலோசனை.",
    evidenceGuidance: "அறிவியல் ஆதார வழிகாட்டல்",
    noRecsYet: "இந்த பயிர் பருவத்திற்கு இதுவரை ஆலோசனைகள் எதுவும் உருவாக்கப்படவில்லை. மேலே உள்ள \"பரிந்துரை பெறுக\" என்பதை அழுத்தவும்.",
    noEquipment: "உபகரணங்கள் எதுவும் பதிவு செய்யப்படவில்லை.",
    
    // Statuses
    feasible: "முழு சாத்தியம்",
    partial: "பகுதி சாத்தியம்",
    not_feasible: "சாத்தியமில்லை"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('cropcompaz_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    localStorage.setItem('cropcompaz_lang', newLang);
    setLangState(newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
