import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import UserTable from '@/components/users/UserTable';
import { SearchInput } from '@/components/ui/search-input';
import { FilterDialog } from '@/components/users/FilterDialog';
import { ExportButton } from '@/components/users/ExportButton';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    sessions: 0,
    clickRate: 0,
    pageviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsResponse, usersResponse] = await Promise.all([
          axios.get('/api/dashboard/stats'),
          axios.get('/api/users')
        ]);
        
        setStatsData(statsResponse.data);
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(term.toLowerCase()) ||
        user.email?.toLowerCase().includes(term.toLowerCase()) ||
        user.userId?.toString().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };
  
  const handleFilter = (filters) => {
    let filtered = [...users];
    
    // Apply role filter
    if (filters.role && filters.role !== 'All') {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    // Apply type filter
    if (filters.type && filters.type !== 'Any') {
      filtered = filtered.filter(user => user.type === filters.type);
    }
    
    // Apply signed up filter
    if (filters.signedUp && filters.signedUp !== 'Any status') {
      if (filters.signedUp === '1 year ago') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        filtered = filtered.filter(user => new Date(user.signedUp || user.createdAt) <= oneYearAgo);
      } else if (filters.signedUp === '6 months ago') {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        filtered = filtered.filter(user => new Date(user.signedUp || user.createdAt) <= sixMonthsAgo);
      }
    }
    
    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(user => user.country === filters.location);
    }
    
    setFilteredUsers(filtered);
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="p-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="TOTAL USERS" 
            value={statsData.totalUsers.toLocaleString()} 
            change="+5.00%" 
            trend="up" 
            period="From 40" 
            chartData={[0, 2, 14, 16, 18, 30, 40, 42]} 
          />
          <StatsCard 
            title="SESSIONS" 
            value={`${statsData.sessions.toFixed(1)}%`} 
            change="-2.5%" 
            trend="down" 
            period="From 29.1%" 
            chartData={[29, 31, 28, 30, 27, 29, 29.4]} 
          />
          <StatsCard 
            title="AVG. CLICK RATE" 
            value={`${statsData.clickRate.toFixed(1)}%`} 
            change="-0.4%" 
            trend="down" 
            period="From 56.2%" 
            chartData={[56, 58, 57, 59, 58, 55, 56.8]} 
          />
          <StatsCard 
            title="PAGEVIEWS" 
            value="2900" 
            change="+0.448%" 
            trend="up" 
            period="From 2,913" 
            chartData={[90, 88, 91, 87, 92, 89, 92.9]} 
          />
        </div>
        
        {/* Users Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">Users</h2>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <SearchInput 
                placeholder="Search users" 
                value={searchTerm} 
                onChange={handleSearch} 
                className="w-full md:w-auto" 
              />
              <div className="flex space-x-2">
                <ExportButton users={filteredUsers} />
                <FilterDialog onFilter={handleFilter} />
              </div>
            </div>
          </div>
          
          <UserTable users={filteredUsers} />
        </div>
      </div>
    </Layout>
  );
}