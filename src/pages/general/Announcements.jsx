// src/pages/general/Announcements.jsx (FIXED)
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAnnouncements } from "../../api/announcements";
import Card from "../../components/ui/Card";
import { MegaphoneIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";

function Announcements() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetchAnnouncements();
        
        if (!mounted) return;
        
        if (res?.success) {
          // Ensure items is an array
          const data = Array.isArray(res.data) ? res.data : [];
          setItems(data);
        } else {
          // If API fails, use mock data
          setItems(getMockAnnouncements());
          setError("Using demo data - API returned no announcements");
        }
      } catch (err) {
        console.error("Error loading announcements:", err);
        if (!mounted) return;
        
        // Use mock data on error
        setItems(getMockAnnouncements());
        setError("Failed to load announcements. Showing demo data.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAnnouncements();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Mock announcements for demo/fallback
  const getMockAnnouncements = () => {
    return [
      {
        id: 1,
        title: "Mid-Term Examination Schedule",
        body: "Mid-term examinations will be held from November 15th to November 25th. Please check your timetable.",
        createdAt: new Date().toISOString(),
        category: "Academic",
        isImportant: true
      },
      {
        id: 2,
        title: "Library Renovation",
        body: "The central library will be closed for renovation from December 1st to December 15th.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        category: "Facilities",
        isImportant: false
      },
      {
        id: 3,
        title: "Sports Day 2023",
        body: "Annual sports day will be held on December 20th. Registrations are open.",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        category: "Events",
        isImportant: false
      }
    ];
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <MegaphoneIcon className="h-6 w-6 mr-2" />
          Announcements
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Important updates and notifications from the university
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Announcements List */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
                <span className="text-sm text-gray-500">
                  {loading ? "Loading..." : `${items.length} announcements`}
                </span>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-full mb-3"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8">
                  <MegaphoneIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-4 text-gray-500">No announcements available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border ${
                        announcement.isImportant
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      } hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {announcement.title}
                            {announcement.isImportant && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Important
                              </span>
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {announcement.body || announcement.content}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {announcement.category && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {announcement.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar - Stats and Filters */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Announcement Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Announcements</span>
                  <span className="text-lg font-bold text-gray-900">{items.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Important</span>
                  <span className="text-lg font-bold text-red-600">
                    {items.filter(a => a.isImportant).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-lg font-bold text-blue-600">
                    {items.filter(a => {
                      const date = new Date(a.createdAt);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {['Academic', 'Events', 'Facilities', 'General'].map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {items.filter(a => a.category === category).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user?.role === 'ADMIN' && (
                  <Button className="w-full">
                    Create New Announcement
                  </Button>
                )}
                <Button variant="secondary" className="w-full">
                  View All
                </Button>
                <Button variant="ghost" className="w-full">
                  Subscribe to Updates
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Announcements;