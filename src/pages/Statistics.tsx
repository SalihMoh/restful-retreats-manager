
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Hotel, MapPin, ChartPie, BarChart3, Star, Award } from "lucide-react";

const Statistics = () => {
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

  const ratingData = [
    { name: "5★", value: 0, color: "#EF4444" },
    { name: "4★", value: 0, color: "#F97316" },
    { name: "3★", value: 0, color: "#FBBF24" },
    { name: "2★", value: 0, color: "#A3E635" },
    { name: "1★", value: 0, color: "#22D3EE" },
  ];
  
  // Populate chart data from hotels
  useEffect(() => {
    if (hotels && hotels.length > 0) {
      // Reset counts
      priceRangeData.forEach(item => item.value = 0);
      locationData.forEach(item => item.value = 0);
      ratingData.forEach(item => item.value = 0);
      
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

        // Ratings
        const rating = Math.floor(hotel.rating);
        if (rating >= 1 && rating <= 5) {
          ratingData[5 - rating].value += 1;
        }
      });
    }
  }, [hotels]);

  return (
    <div className="container mx-auto py-10 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 hero-title red-text-gradient">
          Statistiques Hôtelières
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explorez les données et tendances de notre réseau d'hôtels à travers ces visualisations interactives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Price Range Distribution Chart */}
        <Card className="hover:shadow-lg transition-shadow border-red-500/20 shadow-md">
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
        <Card className="hover:shadow-lg transition-shadow border-red-500/20 shadow-md">
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

      {/* Rating Distribution Chart */}
      <Card className="mb-16 hover:shadow-lg transition-shadow border-red-500/20 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Distribution des évaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} hôtels`, '']} />
                <Legend />
                <Bar dataKey="value" name="Nombre d'hôtels">
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Ce graphique montre la distribution des hôtels par évaluation, vous permettant de voir la qualité générale de notre sélection.</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-red-900/20 to-red-700/10 border-red-500/20 shadow-md">
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

        <Card className="bg-gradient-to-br from-red-900/20 to-red-700/10 border-red-500/20 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Top des Destinations</h3>
              <p className="text-sm text-muted-foreground">
                Explorez nos destinations les plus populaires offrant des expériences uniques et mémorables.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/20 to-red-700/10 border-red-500/20 shadow-md">
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
    </div>
  );
};

export default Statistics;
