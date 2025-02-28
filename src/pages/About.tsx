
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Hotel, Star, Shield, Clock, Award, Users, Heart, ChevronRight, MapPin, CalendarDays, ChartPie } from "lucide-react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const { hotels } = useSelector((state: RootState) => state.hotels);
  
  // Prepare data for charts
  const priceRangeData = [
    { name: "Économique (< $200)", value: 0, color: "#EF4444" },
    { name: "Intermédiaire ($200-$350)", value: 0, color: "#F97316" },
    { name: "Premium ($350-$500)", value: 0, color: "#8B5CF6" },
    { name: "Luxe (> $500)", value: 0, color: "#EC4899" },
  ];
  
  const locationData = [
    { name: "Europe", value: 0, color: "#10B981" },
    { name: "Amérique", value: 0, color: "#3B82F6" },
    { name: "Asie", value: 0, color: "#F59E0B" },
    { name: "Afrique", value: 0, color: "#6366F1" },
    { name: "Océanie", value: 0, color: "#EC4899" },
  ];
  
  // Populate chart data from hotels
  useEffect(() => {
    if (hotels && hotels.length > 0) {
      // Reset counts
      priceRangeData.forEach(item => item.value = 0);
      locationData.forEach(item => item.value = 0);
      
      // Process hotel data
      hotels.forEach(hotel => {
        // Price ranges
        if (hotel.price < 200) {
          priceRangeData[0].value += 1;
        } else if (hotel.price >= 200 && hotel.price < 350) {
          priceRangeData[1].value += 1;
        } else if (hotel.price >= 350 && hotel.price < 500) {
          priceRangeData[2].value += 1;
        } else {
          priceRangeData[3].value += 1;
        }
        
        // Locations (simplified for demo)
        if (hotel.location.includes("Europe") || hotel.location.includes("Swiss") || hotel.location.includes("France")) {
          locationData[0].value += 1;
        } else if (hotel.location.includes("America") || hotel.location.includes("USA") || hotel.location.includes("Canada")) {
          locationData[1].value += 1;
        } else if (hotel.location.includes("Asia") || hotel.location.includes("China") || hotel.location.includes("Japan")) {
          locationData[2].value += 1;
        } else if (hotel.location.includes("Africa") || hotel.location.includes("Egypt") || hotel.location.includes("Morocco")) {
          locationData[3].value += 1;
        } else if (hotel.location.includes("Maldives") || hotel.location.includes("Australia")) {
          locationData[4].value += 1;
        } else {
          // Default to Europe for any unmatched locations
          locationData[0].value += 1;
        }
      });
    }
  }, [hotels]);

  // Updated team members - now only showing Mohamed Salih
  const teamMembers = [
    {
      name: "Mohamed Salih",
      role: "Fondateur & CEO",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Passionné par l'hospitalité de luxe avec plus de 15 ans d'expérience dans le secteur hôtelier. Fondateur visionnaire de notre plateforme révolutionnaire de réservation d'hôtels."
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Fondation",
      description: "Création de notre plateforme avec une vision innovante pour le secteur hôtelier."
    },
    {
      year: "2019",
      title: "Croissance initiale",
      description: "Expansion à 100 hôtels partenaires et 10,000 clients satisfaits."
    },
    {
      year: "2020",
      title: "Innovation technologique",
      description: "Lancement de notre application mobile et système de réservation instantanée."
    },
    {
      year: "2021",
      title: "Expansion internationale",
      description: "Ouverture dans 5 nouveaux pays avec une croissance de 200% des réservations."
    },
    {
      year: "2022",
      title: "Récompenses d'excellence",
      description: "Reconnaissance comme leader du secteur avec 3 prix d'innovation."
    },
    {
      year: "2023",
      title: "Aujourd'hui",
      description: "Plus de 500 hôtels partenaires et 1 million de nuits réservées."
    }
  ];

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 hero-title red-text-gradient">
            Notre Histoire
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez comment nous révolutionnons l'expérience de réservation d'hôtels depuis 2018
          </p>
        </div>

        {/* Interactive Tab Navigation */}
        <div className="mb-12 flex justify-center">
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            <button 
              onClick={() => setActiveTab("about")} 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${activeTab === "about" ? "bg-primary text-white shadow-md" : "hover:bg-muted-foreground/10"}`}
            >
              Notre Mission
            </button>
            <button 
              onClick={() => setActiveTab("team")} 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${activeTab === "team" ? "bg-primary text-white shadow-md" : "hover:bg-muted-foreground/10"}`}
            >
              Notre Équipe
            </button>
            <button 
              onClick={() => setActiveTab("timeline")} 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${activeTab === "timeline" ? "bg-primary text-white shadow-md" : "hover:bg-muted-foreground/10"}`}
            >
              Notre Histoire
            </button>
            <button 
              onClick={() => setActiveTab("analytics")} 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${activeTab === "analytics" ? "bg-primary text-white shadow-md" : "hover:bg-muted-foreground/10"}`}
            >
              <span className="flex items-center gap-1">
                <ChartPie className="h-4 w-4" />
                Statistiques
              </span>
            </button>
          </div>
        </div>

        {/* About Content */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Révolutionner l'industrie hôtelière en offrant une plateforme intuitive et transparente qui connecte les voyageurs avec les meilleurs hôtels du monde.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Excellence du service</h3>
                    <p className="text-muted-foreground">Nous nous engageons à offrir une expérience client exceptionnelle à chaque étape.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Sécurité et confidentialité</h3>
                    <p className="text-muted-foreground">Protection rigoureuse des données et transactions sécurisées garanties.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Disponibilité 24/7</h3>
                    <p className="text-muted-foreground">Support client disponible à tout moment pour répondre à vos besoins.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/register')} 
                className="btn-red-gradient flex items-center gap-2"
              >
                Rejoignez-nous <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Animated Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg h-48 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60" 
                    alt="Hotel lobby" 
                    className="w-full h-full object-cover hover-scale"
                  />
                </div>
                <div className="overflow-hidden rounded-lg h-64 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60" 
                    alt="Hotel room" 
                    className="w-full h-full object-cover hover-scale"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-10">
                <div className="overflow-hidden rounded-lg h-64 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60" 
                    alt="Hotel pool" 
                    className="w-full h-full object-cover hover-scale"
                  />
                </div>
                <div className="overflow-hidden rounded-lg h-48 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&auto=format&fit=crop&q=60" 
                    alt="Hotel view" 
                    className="w-full h-full object-cover hover-scale"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Content */}
        {activeTab === "team" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Notre Équipe</h2>
            <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Découvrez la personne passionnée qui travaille chaque jour pour vous offrir la meilleure expérience de réservation d'hôtel.
            </p>
            
            {/* Single Team Member Card - Centered */}
            <div className="max-w-md mx-auto">
              <div 
                className="group relative bg-card overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-border card-hover animate-fade-in"
              >
                <div className="h-80 overflow-hidden">
                  <img 
                    src={teamMembers[0].image} 
                    alt={teamMembers[0].name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-black/0 text-white">
                  <h3 className="text-2xl font-bold">{teamMembers[0].name}</h3>
                  <p className="text-red-300 font-medium">{teamMembers[0].role}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold">{teamMembers[0].name}</h3>
                    <p className="text-red-300 font-medium mb-2">{teamMembers[0].role}</p>
                    <p className="text-gray-300">{teamMembers[0].bio}</p>
                    <div className="flex space-x-3 mt-4">
                      <a href="#" className="text-white hover:text-red-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-red-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-red-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Content */}
        {activeTab === "timeline" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Notre Parcours</h2>
            <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Un aperçu de notre évolution et des étapes importantes qui ont façonné notre entreprise.
            </p>
            
            <div className="relative border-l border-primary/30 ml-6 md:ml-0 md:mx-auto md:max-w-3xl pl-8 space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute -left-[41px] flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary ring-8 ring-background">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div className="hover-scale">
                    <time className="mb-1 text-lg font-bold leading-none red-text-gradient">{milestone.year}</time>
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts & Analytics Content - NEW */}
        {activeTab === "analytics" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center">Nos Statistiques Hôtelières</h2>
            <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Explorez les données de notre réseau d'hôtels partenaires à travers ces visualisations interactives.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Price Range Distribution Chart */}
              <Card className="hover:shadow-lg transition-shadow border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartPie className="h-5 w-5 text-primary" />
                    Distribution des gammes de prix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={priceRangeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                          label={(entry) => entry.name}
                          labelLine
                        >
                          {priceRangeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} hôtels`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Cette visualisation montre la répartition des hôtels partenaires par gamme de prix, permettant d'identifier les segments les plus représentés dans notre offre.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Distribution Chart */}
              <Card className="hover:shadow-lg transition-shadow border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Distribution par région
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={locationData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          label={(entry) => entry.name}
                          labelLine
                        >
                          {locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} hôtels`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Découvrez la répartition géographique de nos hôtels partenaires à travers le monde, illustrant notre présence internationale.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Added Hotel Insights - For visual appeal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-gradient-to-br from-red-900/20 to-red-700/10 border-red-500/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="mx-auto rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-4">
                      <Hotel className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Hôtels de Luxe</h3>
                    <p className="text-sm text-muted-foreground">
                      Nos hôtels de luxe offrent une expérience incomparable avec des services premium et des commodités exclusives.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/20 to-red-700/10 border-red-500/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="mx-auto rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Top des Destinations</h3>
                    <p className="text-sm text-muted-foreground">
                      Explorez nos destinations les plus populaires offrant des expériences uniques et mémorables.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/20 to-red-700/10 border-red-500/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="mx-auto rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Meilleures Évaluations</h3>
                    <p className="text-sm text-muted-foreground">
                      Découvrez les hôtels les mieux notés par nos clients pour un séjour parfait.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="btn-red-gradient"
              >
                Voir tous les hôtels
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="py-16 mt-20 bg-gradient-to-r from-black/70 to-red-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Nos Réalisations</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-white">500+</div>
              <div className="text-lg font-medium text-red-300">Hôtels Partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-white">120k+</div>
              <div className="text-lg font-medium text-red-300">Clients Satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-white">20+</div>
              <div className="text-lg font-medium text-red-300">Pays Couverts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-white">1M+</div>
              <div className="text-lg font-medium text-red-300">Nuits Réservées</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir la différence?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez notre communauté de voyageurs et découvrez une nouvelle façon de réserver vos séjours hôteliers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/register')} 
              className="btn-red-gradient"
              size="lg"
            >
              S'inscrire maintenant
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')} 
              size="lg"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
