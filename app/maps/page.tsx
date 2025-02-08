import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RocketIcon, Globe, Search, Filter } from "lucide-react";
import Image from "next/image";
import RestaurantCard from './restaurantcard';

const sampleData = [
  {
      "accessibility_details": {},
      "accessibility_score": "Low",
      "address": "Unknown",
      "child_friendly": "Unknown",
      "features": {
          "delivery": true,
          "dine_in": false,
          "good_for_groups": false,
          "outdoor_seating": false,
          "reservable": false,
          "restroom": false,
          "serves_beer": false,
          "serves_breakfast": false,
          "serves_dinner": false,
          "serves_lunch": false,
          "serves_wine": false,
          "takeout": true
      },
      "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
      "image": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AVzFdbmTn0J5geUHt53KxB1WAeQMekbR7nnh2QdI6m47sJQuh503uhLKHHInysnmAfWnth2si-OJzJ88WZE1n7o62xobp9jD_K0szMrEDbn_uKCvH8IZn6aMpcmXLqjFqXMpEWcPFDeWAA1y2eIsaXyD6XOdV7bMyJmPaTwGh5mgFnoVIcm3&key=AIzaSyAwevOnGuifv33Rodc_Uch0jSkFuTLi-7g",
      "latitude": 19.2305683,
      "longitude": 72.8396163,
      "name": "Best Chinese Food",
      "opening_hours": [],
      "pet_friendly": "Unknown",
      "phone_number": "Unknown",
      "place_id": "ChIJHyl8qmKx5zsRCy3-efDEiBc",
      "price_level": "Unknown",
      "rating": 4.8,
      "reviews": [
          {
              "author": "Anonymous",
              "rating": 4,
              "text": "We enjoyed the food here. Great Chinese food is available here with decent prices for groups and also for individuals as well. I really enjoyed it here.\nSecondly, they also provide free home delivery but with a minimum 500rs order should be there.",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Good Food",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Nice Tast & Yummy Tast",
              "time": ""
          }
      ],
      "total_ratings": 0,
      "types": [
          "restaurant",
          "food",
          "point_of_interest",
          "establishment"
      ],
      "website": "Unknown"
  },
  {
      "accessibility_details": {},
      "accessibility_score": "Low",
      "address": "Unknown",
      "child_friendly": "Unknown",
      "features": {
          "delivery": true,
          "dine_in": false,
          "good_for_groups": false,
          "outdoor_seating": false,
          "reservable": true,
          "restroom": false,
          "serves_beer": false,
          "serves_breakfast": false,
          "serves_dinner": false,
          "serves_lunch": false,
          "serves_wine": false,
          "takeout": true
      },
      "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
      "image": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AVzFdblZU21VOIVK8v4cCxgGcft9JJNM_ltG0AOiGQMxlmFnY9B6t3atUraWX4dMPezi79dPRbmcuoTL6Bc7WwRdTbw5k92dca2wSK71XC3XfivfHM6n_yiyzO0zgxOs-Y1hDulvDy0RYfpwrmKUDSyT4RkEJjfoD5kyIQf07ilGzvic-rvX&key=AIzaSyAwevOnGuifv33Rodc_Uch0jSkFuTLi-7g",
      "latitude": 19.2295959,
      "longitude": 72.8416214,
      "name": "Aadhya Chinese Cuisine",
      "opening_hours": [],
      "pet_friendly": "Unknown",
      "phone_number": "Unknown",
      "place_id": "ChIJH3rfHn2x5zsRZPemrAkeKqI",
      "price_level": "Unknown",
      "rating": 4.9,
      "reviews": [
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Enjoyed the time I spend there with such a nice staff and amazing taste",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Loved the taste... great experience , you can enjoy here with family and friends",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Amazing food! Total value for money",
              "time": ""
          }
      ],
      "total_ratings": 0,
      "types": [
          "restaurant",
          "food",
          "point_of_interest",
          "establishment"
      ],
      "website": "Unknown"
  },
  {
      "accessibility_details": {},
      "accessibility_score": "Low",
      "address": "Unknown",
      "child_friendly": "Unknown",
      "features": {
          "delivery": true,
          "dine_in": false,
          "good_for_groups": false,
          "outdoor_seating": false,
          "reservable": true,
          "restroom": false,
          "serves_beer": false,
          "serves_breakfast": false,
          "serves_dinner": false,
          "serves_lunch": false,
          "serves_wine": false,
          "takeout": true
      },
      "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
      "image": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AVzFdbkdt9UIGnT3nuevEsqjjdG8izeI-Yf9cPvVqBHSTvgySncKzYL9Y8WhSBAx0r8FajUAjrMWAuzjOklxze4RH5OGArqFFyCtmM7_1jSl4ajd2FhBbfcHsuEu965fSkB5sfUvHjbicYkKscVS2Xd6PR2DeSv7JBMKtElZ8e9X61zQJxQO&key=AIzaSyAwevOnGuifv33Rodc_Uch0jSkFuTLi-7g",
      "latitude": 19.0609124,
      "longitude": 72.8629578,
      "name": "Yauatcha Mumbai",
      "opening_hours": [],
      "pet_friendly": "Unknown",
      "phone_number": "Unknown",
      "place_id": "ChIJf3bw-efI5zsRtdR6zgH_FnQ",
      "price_level": "Unknown",
      "rating": 4.5,
      "reviews": [
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Yauatcha is undoubtedly a fantastic fine dining experience! The ambiance is chic and modern, perfect for a classy night out or a special occasion. The food is exceptional, with a wide variety of dim sums, desserts, and other Cantonese dishes that are beautifully presented and bursting with flavor. The service is impeccable, with attentive staff who make you feel well taken care of.\n\nThat said, it’s definitely on the pricier side, so it’s more of a treat-yourself kind of place. If you’re looking to elevate your experience, I highly recommend trying their sake—it pairs wonderfully with the food and adds an extra layer of sophistication to the meal.\n\nOverall, Yauatcha is a must-visit for anyone who appreciates great food and a luxurious dining experience, but be prepared for a splurge!",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 2,
              "text": "I was in town for Coldplay and was really excited for my Bombay trip in general because I would get to go to my favourite Asian eatery. I reached all happy waiting to burst into flavours and try the lunch set menu but to my surprise, I was met with judgemental eyes and a horrible undertone by the manager who was taking care of our table, Shairaz. I have never previously tried their lunch menu so I had a couple of questions which I was asking him such as if I can change a seafood dish to a chicken dish or are their drinks included are the dimsums unlimited? As none of this was mentioned or I couldn’t simply find it (both are okay, as I work in hospitality myself) but the tone I was getting from him and the replies were beyond horrible. He was heavily judging myself and treating me like who am I and how’ve I landed here in this restaraunt. I told you this, nothing like that is included? We can’t change anything. No please. no sorry, no thank you. Only snobbish and bratty behaviour by Shairaz.\n\nSecond instance. We were a group of three people who each ordered separate set menus as per dietary restrictions etc and we were expecting two sets of chicken and coriander dumplings on our table. Service was horrible. I had to ask like more than a dozen times for the dumplings and when Shairaz came to the table and I asked him we are still waiting for the dumplings to arrive, are you sure you haven’t eaten already? Haven’t they already been sent to your table? He was accusing our table of such mean things that at once I felt telling him who I am but I don’t want to do this and I want to be treated like how a customer should be treated irrespective of who they’re. I really felt like leaving the restaraunt as firstly we weren’t getting food on time, service was delayed and then when we were asking we were being met with judgemental sarcastic negative tones and energy that they’ve already served and we’ve already eaten. How’s that even possible lol. Check the table register or pet Pooja dashboard or ask your manager or check CCTVs. It’s shameful that I had to even think of proving what has come to our table in a restaraunt which was only 60% of the capacity when we arrived.\n\nThe cherry on the cake was finding multiple strands of hair in our main course. Pictures attached.\n\nI felt disappointed and I am never going back. Never.",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Yauatcha is the perfect blend of luxury and culinary excellence. The ambiance is super chic and boogie, making it ideal for a special dining experience.\n\nThe quality of the food is consistently top-notch—every dish is bursting with flavor and beautifully presented. I've visited multiple times, and it never disappoints.\n\nTasty food, impeccable service, and an overall amazing experience. Absolutely worth every penny! Highly recommend for anyone who appreciates fine dining.",
              "time": ""
          }
      ],
      "total_ratings": 0,
      "types": [
          "bakery",
          "bar",
          "store",
          "restaurant",
          "food",
          "point_of_interest",
          "establishment"
      ],
      "website": "Unknown"
  },
  {
      "accessibility_details": {},
      "accessibility_score": "Low",
      "address": "Unknown",
      "child_friendly": "Unknown",
      "features": {
          "delivery": true,
          "dine_in": false,
          "good_for_groups": false,
          "outdoor_seating": false,
          "reservable": true,
          "restroom": false,
          "serves_beer": false,
          "serves_breakfast": false,
          "serves_dinner": false,
          "serves_lunch": false,
          "serves_wine": false,
          "takeout": true
      },
      "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
      "image": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AVzFdbnK443ZEy3VjnHhjMNK2yQ1h75kpyQehGqP9GOgGkJi3ckfoOttWAaY9aP2X4lnSBIfmrmQVai7wXpyBKkFhNDg2YhmlXOT4kwHvAZXFhnmL7zd0mnI0ax1f3I2oyMw3AqaVPr2FSMHJ3oAxTeQf8FCD8R08sVZBcHetAKW4IL6XHYG&key=AIzaSyAwevOnGuifv33Rodc_Uch0jSkFuTLi-7g",
      "latitude": 19.2301293,
      "longitude": 72.8474638,
      "name": "Trishiv Chinese Bistro Corner - VEG | JAIN CHINESE PIZZA PASTA RESTAURENT",
      "opening_hours": [],
      "pet_friendly": "Unknown",
      "phone_number": "Unknown",
      "place_id": "ChIJzYvuCCCx5zsRMc-0KNKGWWU",
      "price_level": "Unknown",
      "rating": 4.2,
      "reviews": [
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "We ordered the Manchurian on 15th Aug for 50/- only. First impression was in 50/- they will provide only 4 to 5 balls, and we were ready for that. But when we actually opened the box literally we were amazed seeing the quantity.\n\nThey have not at all altered the quantity and the quality, no compromise at all in the quality.\n\nPacking was perfect ✌\n\nOverall the great experience, you must give it a try 🙂🙂",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "Went to this place on my visit to Mumbai. The place is perfect for chinese lovers! Loved everything about the place. The food, the atmosphere and the service. Not to forget the polite staff. Though everything I ordered was delicious but my personal favorite was the taiwan bhel ( A must try!)",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "I love dining at compact size restaurants. I never uploaded any review of them so far but what differentiates them is specialized in specific areas. That's value addition for me. I came across this beautiful place located at Borivali West which highlights on Chinese cuisines. They have huge varieties to choose from. I was fortunate to met the owners Mr Akash and Mrs Diti of @trishivchinesemumbai . Both husband wife are so passionate, enthusiastic and eager to serve patrons, helps recommendation. I had an excellent time to converse with them. They said every dish is different than each other and also prepares with fresh ingredients. Schezwan sauce is made inhouse. Yes, I immediately felt difference while eating.  Menu is extensive and names are very unique too.\nMy review follows -\nI had Peach Ice Tea. You can decide what to order while sipping on mocktails.\nStarting with Soup\nTrishiv Special soup - Red in color. Chopped vegetables, nicely spiced. Garlic taste to it. It is very thick.\nStarters\nKatori - Absolute unique and love how that fried noodles wrapped up so easily in circular motion. It is also available on weekdays as well. It is a must try. Different textures. You feel the richness of the sauce and that cheese cream. Cheese is not over powering.\nCheese Paper roll - Cone shaped deeply fried, a perfect crunch from outside. Stuffed vegetables with sauce. They also served Khimchi and Cabbage Salad topped with pepper powder.\nGreen Manchurian - Unique. Manchurian balls made specially from spinach. It was crisp and deep fried. Not too oily.\nMain course\nThai Rice - A simple and worth trying. You order Thai Rice Curry too. Rice contains deep fried vegetables inside rice which was spicy. Sprinkled with some Green onions. Had a little bit schezwan taste to it.\nTo end meal Dessert\nChoco Lava Rolls - The best way to end meal. Very gluey and your mouth will experience chocolate blast. The outer crisp layer was not too thick which contrasted nice with Chocolate. Small Choco chips sprinkled on top with Chocolate sauce.\nThis restaurant is definitely stood out by menu and preparations. Highly recommend for Chinese Lovers.",
              "time": ""
          }
      ],
      "total_ratings": 0,
      "types": [
          "meal_takeaway",
          "restaurant",
          "food",
          "point_of_interest",
          "establishment"
      ],
      "website": "Unknown"
  },
  {
      "accessibility_details": {},
      "accessibility_score": "Low",
      "address": "Unknown",
      "child_friendly": "Unknown",
      "features": {
          "delivery": true,
          "dine_in": false,
          "good_for_groups": false,
          "outdoor_seating": false,
          "reservable": false,
          "restroom": false,
          "serves_beer": false,
          "serves_breakfast": false,
          "serves_dinner": false,
          "serves_lunch": false,
          "serves_wine": false,
          "takeout": true
      },
      "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
      "image": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=AVzFdbnmrJG2cCPVJr91QSdeLQwyR9rqMfglinNmpNGUAU1He50fCqf0_1Ttte3yLtqa06gsyM2QN8TiGSW9OszN3w0MUaS_x2LX7j67Zan6RCETnAw8KDFmoujgWMrLGXoPMYaZ39QFCyyv_AFldBJNxX5n40DkzHmYhqqGZGOc34Vv4L-I&key=AIzaSyAwevOnGuifv33Rodc_Uch0jSkFuTLi-7g",
      "latitude": 19.2283932,
      "longitude": 72.84752569999999,
      "name": "Night Evil Chinese Food",
      "opening_hours": [],
      "pet_friendly": "Unknown",
      "phone_number": "Unknown",
      "place_id": "ChIJDT0j1Cmx5zsRIj6FYmt8dhM",
      "price_level": "Unknown",
      "rating": 3.8,
      "reviews": [
          {
              "author": "Anonymous",
              "rating": 5,
              "text": "We all want it back as a good sitting restaurant in Borivali West we love your non AC will also do, till now nobody can match your taste in Chinese food really, Agree that your \"Competitors are only in China\", from my childhood I had enjoyed your Chinese food. Please to bring it back in business like Before. 5 Star Chinese food restaurant.......",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 4,
              "text": "With a menu that is entirely dedicated to Chinese cuisine and with us craving for some yummy Chinese food, we decided to order from here and weren't disappointed at all. Food packaging was nice and clean and the food was delivered to us quite quickly. We ordered the following from here :\nChicken Sweet Corn Soup - The perfect soup to have when you are not feeling well due the change in climate. With generous amounts of shredded chicken and sweet corn, this was one tummy filling soup. Warming, satisfying and most importantly a delicious bowl of goodness..🤤\nChicken American Chopsuey - Not all places can prepare a good Chicken American Chopsuey, but this place isn't one of them. The all important chicken gravy which goes on top of a bed of crispy fried noodles was damn flavourful. It was just the right amount of sweet and went well with the noodles. We loved it..😋",
              "time": ""
          },
          {
              "author": "Anonymous",
              "rating": 2,
              "text": "Have been eating here since childhood but the recent order has taken the quality to a new low. Hoping to get the old Night evil taste & quality back soon.",
              "time": ""
          }
      ],
      "total_ratings": 0,
      "types": [
          "restaurant",
          "food",
          "point_of_interest",
          "establishment"
      ],
      "website": "Unknown"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#E91E63] to-[#FF4081] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2 animate-fade-in">
              PITCH YOUR STARTUP IDEA <RocketIcon className="h-6 md:h-8 w-6 md:w-8" />
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              BUILD YOUR NETWORK <Globe className="h-5 md:h-7 w-5 md:w-7" />
            </h2>
          </div>
          <p className="text-base md:text-lg mb-8 text-center max-w-2xl mx-auto">
            Submit ideas, vote on pitches and get noticed in virtual competitions
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input 
                  type="search"
                  placeholder="Search Startups" 
                  className="pl-4 pr-10 py-6 w-full rounded-full bg-white/90 backdrop-blur-sm text-black shadow-lg focus:ring-2 focus:ring-pink-400"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button 
                className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Section Header */}
     

        

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {sampleData.map((restaurant, index) => (
    <div key={index} className="w-full h-max-content">
      <RestaurantCard {...restaurant} />
    </div>
  ))}
</div>
        {/* Load More */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            className="rounded-full px-8"
          >
            Load More
          </Button>
        </div>
      </div>

    
    </main>
  );
}