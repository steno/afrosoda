import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Mail, Building, Calendar, User, Phone, MapPin, MessageSquare, CheckCircle, Clock, AlertCircle, X, Lock, Trash2 } from 'lucide-react';
import SimpleLayout from '../components/SimpleLayout';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ContactSubmission {
  id: string;
  business_type: string;
  company: string;
  street: string;
  postal_code: string;
  city: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email: string;
  message?: string;
  marketing_consent: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  
  // Simple authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Valid admin credentials
  const validCredentials = [
    { email: 'info@africadrinks.de', password: '123456' },
    { email: 'stefan.asemota@gmail.com', password: '123456' }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Trim and normalize inputs
    const trimmedEmail = loginEmail.trim().toLowerCase();
    const trimmedPassword = loginPassword.trim();

    const isValid = validCredentials.some(
      cred => cred.email.toLowerCase() === trimmedEmail && cred.password === trimmedPassword
    );

    if (isValid) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('Invalid email or password');
      console.log('Login attempt failed:', { trimmedEmail, trimmedPassword }); // Debug log
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLoginModal(true);
    setSubmissions([]);
    setSelectedSubmission(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this email? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Remove from local state
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      
      // Clear selected submission if it was the deleted one
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }

      alert('Email deleted successfully');
    } catch (err) {
      console.error('Error deleting submission:', err);
      alert('Error deleting email: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // Use anon client to bypass RLS for now - we'll control access with the login modal
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, status: newStatus, updated_at: new Date().toISOString() }
            : sub
        )
      );

      // Update selected submission if it's the one being updated
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => 
          prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : null
        );
      }
    } catch (err) {
      console.error('Error updating submission status:', err);
      alert('Error updating status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels = {
      restaurant: 'Restaurant',
      supplier: 'Supplier',
      hotel: 'Hotel',
      bar: 'Bar'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <SimpleLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          {/* Login Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
              <p className="text-gray-600">Enter your credentials to access the admin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Demo credentials:<br />
                <span className="font-mono text-xs">info@africadrinks.de / 123456</span><br />
                <span className="font-mono text-xs">stefan.asemota@gmail.com / 123456</span>
              </p>
            </div>
          </motion.div>
        </div>
      </SimpleLayout>
    );
  }

  if (loading) {
    return (
      <SimpleLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (error) {
    return (
      <SimpleLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading submissions: {error}</p>
            <button 
              onClick={fetchSubmissions}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Emails</h1>
            <p className="text-gray-600">Manage emails from potential business partners</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Logout
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span className="text-gray-600">Total Emails: </span>
                <span className="font-semibold text-gray-900">{submissions.length}</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span className="text-gray-600">Unread: </span>
                <span className="font-semibold text-blue-600">
                  {submissions.filter(s => s.status === 'new').length}
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span className="text-gray-600">Read: </span>
                <span className="font-semibold text-yellow-600">
                  {submissions.filter(s => s.status === 'in_progress').length}
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span className="text-gray-600">Replied: </span>
                <span className="font-semibold text-green-600">
                  {submissions.filter(s => s.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Business Emails</h2>
                </div>
                <div className="divide-y">
                  {submissions.length === 0 ? (
                    <div className="p-8 text-center">
                      <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No emails yet</p>
                    </div>
                  ) : (
                    submissions.map((submission) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedSubmission?.id === submission.id ? 'bg-purple-50 border-r-4 border-purple-600' : ''
                        }`}
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {submission.first_name} {submission.last_name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(submission.status)}`}>
                              {submission.status === 'new' ? 'unread' : submission.status === 'in_progress' ? 'read' : 'replied'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubmission(submission.id);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                              title="Delete submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {submission.company} • {getBusinessTypeLabel(submission.business_type)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {submission.email}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(submission.created_at)}
                          </div>
                          {submission.message && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Has message
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div className="lg:col-span-1">
              {selectedSubmission ? (
                <div className="bg-white rounded-lg shadow-sm border sticky top-4">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Email Details</h2>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedSubmission.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedSubmission.status)}`}>
                          {selectedSubmission.status === 'new' ? 'unread' : selectedSubmission.status === 'in_progress' ? 'read' : 'replied'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Contact Information */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Contact Person
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Name:</strong> {selectedSubmission.first_name} {selectedSubmission.last_name}</p>
                        <p><strong>Email:</strong> {selectedSubmission.email}</p>
                        {selectedSubmission.phone && (
                          <p><strong>Phone:</strong> {selectedSubmission.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Business Information */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Business Details
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Company:</strong> {selectedSubmission.company}</p>
                        <p><strong>Type:</strong> {getBusinessTypeLabel(selectedSubmission.business_type)}</p>
                        <p><strong>Address:</strong></p>
                        <div className="ml-4">
                          <p>{selectedSubmission.street}</p>
                          <p>{selectedSubmission.postal_code} {selectedSubmission.city}</p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {selectedSubmission.message && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </h3>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {selectedSubmission.message}
                        </div>
                      </div>
                    )}

                    {/* Consent Information */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Consent</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Marketing:</strong> 
                          <span className={selectedSubmission.marketing_consent ? 'text-green-600' : 'text-red-600'}>
                            {selectedSubmission.marketing_consent ? ' ✓ Consented' : ' ✗ Not consented'}
                          </span>
                        </p>
                        <p className="text-green-600">
                          <strong>Privacy:</strong> ✓ Agreed to privacy policy
                        </p>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Timeline
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Submitted:</strong> {formatDate(selectedSubmission.created_at)}</p>
                        <p><strong>Last Updated:</strong> {formatDate(selectedSubmission.updated_at)}</p>
                      </div>
                    </div>

                    {/* Email Actions */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Email Status</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => updateSubmissionStatus(selectedSubmission.id, 'new')}
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedSubmission.status === 'new'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          Mark as Unread
                        </button>
                        <button
                          onClick={() => updateSubmissionStatus(selectedSubmission.id, 'in_progress')}
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedSubmission.status === 'in_progress'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          Mark as Read
                        </button>
                        <button
                          onClick={() => updateSubmissionStatus(selectedSubmission.id, 'completed')}
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedSubmission.status === 'completed'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          Mark as Replied
                        </button>
                      </div>
                    </div>

                    {/* Delete Section */}
                    <div className="border-t pt-4">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Delete Email
                      </h3>
                      <button
                        onClick={() => deleteSubmission(selectedSubmission.id)}
                        className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Email
                      </button>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        This email will be permanently deleted
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border sticky top-4">
                  <div className="p-8 text-center">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select an email to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default AdminPage;
