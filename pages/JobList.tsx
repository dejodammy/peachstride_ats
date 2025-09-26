import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

export default function JobList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  const jobs = [
    {
      id: 1,
      title: "Business Developer",
      description: "Identify and develop new business opportunities to drive company growth and expansion.",
      location: "Lagos",
      type: "Full-time",
      department: "Business Development",
      posted: "2 days ago",
      requirements: ["3+ years experience", "Strong communication skills", "Business acumen"]
    },
    {
      id: 2,
      title: "Open Market Sales Representative",
      description: "Drive sales growth through market penetration and customer relationship management.",
      location: "Remote",
      type: "Full-time",
      department: "Sales",
      posted: "5 days ago",
      requirements: ["Sales experience", "Self-motivated", "Target-driven mindset"]
    },
    {
      id: 3,
      title: "Vehicle Sales Representative",
      description: "Develop and maintain customer relationships in the automotive sector.",
      location: "Abuja",
      type: "Full-time",
      department: "Sales",
      posted: "1 week ago",
      requirements: ["Automotive knowledge", "Customer service skills", "Valid driver's license"]
    },
  ];

  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || job.location === locationFilter;
      return matchesSearch && matchesLocation;
    });
    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter]);

  const locations = [...new Set(jobs.map(job => job.location))];

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)' 
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10" 
             style={{ backgroundColor: '#ed3237' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10" 
             style={{ backgroundColor: '#848688' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10" 
             style={{ backgroundColor: '#ed3237' }}></div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{
            background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Career Opportunities
          </h1>
          <p className="text-xl" style={{ color: '#848688' }}>
            Discover your next career move with us
          </p>
          <div className="flex items-center justify-center mt-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium" 
                  style={{ backgroundColor: '#ed3237', color: 'white' }}>
              {filteredJobs.length} Open Position{filteredJobs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#373435' }}>
                Search Jobs
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title or description..."
                  className="w-full rounded-xl border-2 px-4 py-3 pl-10 transition-all duration-200 outline-none"
                  style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
                  onFocus={(e) => e.target.style.borderColor = '#ed3237'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                     style={{ color: '#848688' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#373435' }}>
                Filter by Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
                onFocus={(e) => e.target.style.borderColor = '#ed3237'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#373435' }}>
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium border"
                            style={{ backgroundColor: '#f8f9fa', color: '#373435', borderColor: '#ed3237' }}>
                        {job.type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: '#ed3237', color: 'white' }}>
                        {job.department}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm mb-1" style={{ color: '#848688' }}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm" style={{ color: '#848688' }}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.posted}
                    </div>
                  </div>
                </div>

                <p className="mb-4" style={{ color: '#848688', lineHeight: '1.6' }}>
                  {job.description}
                </p>

                {job.requirements && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2" style={{ color: '#373435' }}>
                      Key Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-center text-sm" style={{ color: '#848688' }}>
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#ed3237' }} 
                               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm" style={{ color: '#848688' }}>
                    Ready to join our team?
                  </div>
                  <a
                    href="/apply"
                    className="px-6 py-3 rounded-xl font-medium text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                    style={{ 
                      background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #c5292e 0%, #b02429 100%)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)'}
                  >
                    Apply Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: '#f8f9fa' }}>
                <svg className="w-8 h-8" style={{ color: '#848688' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#373435' }}>
                No jobs found
              </h3>
              <p style={{ color: '#848688' }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 text-center">
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/30">
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#373435' }}>
              Don't see the perfect role?
            </h3>
            <p className="mb-6" style={{ color: '#848688' }}>
              We're always looking for talented individuals to join our team. 
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button 
              className="px-8 py-3 rounded-xl font-medium text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #848688 0%, #6c6e70 100%)',
                border: 'none'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #6c6e70 0%, #5a5c5e 100%)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #848688 0%, #6c6e70 100%)'}
            >
              Submit General Application
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm" style={{ color: '#848688' }}>
          <p>Questions about these positions? Contact our HR team at <span style={{ color: '#ed3237' }}>careers@company.com</span></p>
        </div>
      </div>
    </div>
  );
}